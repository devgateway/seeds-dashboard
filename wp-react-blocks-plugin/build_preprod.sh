echo "EMBEDDABLE_URI=https://ui.tasaivista.dgpreprod.org/#/en/embeddable" > .env

for d in */; do
   echo ".................. Compiling folder $d ..................."

     cd $d
     rm -rf build
     pnpm install
     pnpm run build
     # rm -rf node_modules
     rm pnpm-lock.yaml
    cd ..
done
