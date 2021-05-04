#!/bin/bash
# Update users if database has been already created.
# Users creation on init is left to `init_02_create_user.sh`
BASE_DIR="$(readlink -f $(dirname "$BASH_SOURCE"))"
MONGO_CMD=( mongo --host 127.0.0.1 --port 27017 --quiet )
MONGO_ADMIN_DATABASE=admin

_js_escape() {
	jq --null-input --arg 'str' "$1" '$str'
}

create_root() {
    "${MONGO_CMD[@]}" "$MONGO_ADMIN_DATABASE" <<-EOJS
        db.createUser({
            user: $(_js_escape "$MONGO_INITDB_ROOT_USERNAME"),
            pwd: $(_js_escape "$MONGO_INITDB_ROOT_PASSWORD"),
            roles: [ { role: 'root', db: $(_js_escape "$MONGO_ADMIN_DATABASE") } ]
        })
EOJS
}

create_user() {
    "${MONGO_CMD[@]}" "$MONGO_INITDB_DATABASE" <<-EOJS
        db.createUser({
            user: $(_js_escape "$TASAI_MONGO_USERNAME"),
            pwd: $(_js_escape "$TASAI_MONGO_PASSWORD"),
            roles: [ { role: 'readWrite', db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
        })
EOJS
}



delete_user() {
    # Args:
    #       $1: username
    #       $2: database
    "${MONGO_CMD[@]}" "$2" <<-EOJS
        db.dropUser($(_js_escape "$1"))
EOJS
}

get_user() {
    # Args:
    #       $1: username
    #       $2: database
    "${MONGO_CMD[@]}" "$2" <<-EOJS
        db.getUser($(_js_escape "$1"))
EOJS
}

update_password() {
    # Args:
    #       $1: username
    #       $2: password
    #       $3: database
    "${MONGO_CMD[@]}" "$3" <<-EOJS
        db.updateUser($(_js_escape "$1"), {
            pwd: $(_js_escape "$2")
        })
EOJS
}

upsert_users() {
    user=$(get_user $TASAI_MONGO_USERNAME $MONGO_INITDB_DATABASE)
    if [[ "$user" == "null" ]]; then
        echo "Creating user for ${MONGO_INITDB_DATABASE}..."
        create_user
    else
        echo "Updating user's password..."
        update_password $TASAI_MONGO_USERNAME $TASAI_MONGO_PASSWORD $MONGO_INITDB_DATABASE
    fi

    root=$(get_user $MONGO_INITDB_ROOT_USERNAME $MONGO_ADMIN_DATABASE)
    if [[ "$root" == "null" ]]; then
        echo "Creating super user..."
        create_root
    else
        echo "Updating super user's password..."
        update_password $MONGO_INITDB_ROOT_USERNAME $MONGO_INITDB_ROOT_PASSWORD $MONGO_ADMIN_DATABASE
    fi
    echo 'Done!'
}


