import React, {useEffect} from "react";
import {Container, Grid, GridColumn, GridRow} from "semantic-ui-react";
import {connect} from "react-redux";
import {getDocuments, getImages, getWpCategories, getCrops} from "../reducers/data";
import {
    DATA, SELECTED_COUNTRY, WP_CATEGORIES, WP_DOCUMENTS, DATA_CATEGORY, WP_IMAGES, WP_CROPS
} from "../reducers/StoreConstants";
import './styles.scss';
import CropsLegend from "../chart/common/crop";

const DOCUMENTS_PER_PAGE = 100;
const NO_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABccAAAgACAAAAADGO9QzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflBgcBDylcIgMcAABJ80lEQVR42u3d6Xcc9YHw+5Zaq2XJsizLsi3vm2yMMUsMAcIQMpCESSbJ5Hmec++595zn3fxPk7fPmXPPycwkhDCBQIAkQMBmMwbvu2xk2ZatxZItS63WfTFkwiLVr7q7qhf35/PK0NXVtXR/VV1dS8O/ZACoYY0WAYCOA6DjAOg4gI4DoOMA6DgAOg6g4wDoOACpavrSvwf7LQ+AWjByYvGO9++0bABqwpc6br8KQG3TcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAKqnJIiBFvwg8/s8WEdgeB9BxAHQcAB0HoAh+5/yyX8QZqOF/dic8Wj/2AbbHy2nhkGUA6HhNu3DNMgB0vKYdtAgAHa9pV4YsA0DHa9qhBcsA0PFadvO0ZQDoeE37YN4yAHS8lk0dtQwAHa9pH89aBoCO17K7hy0DQMdr2me3LQNAx2tZ7gPLANDxmnZy3DIAdLyWuVwWoOM1zuWyAB2vce9ZBICO17QRl8sCdLy2uVwWoOO1zeWygCrg/pyl+GBb1kKI5NajYHu8urlcFqDjNc7lsgAdr20ulwXoeI1zuSxAx2uby2UBOl7jXC4L0PHa5nJZgI7XuAtXLQNAx2vaQYsA0PGa5nJZQEU5L790hzY0VHoSpqampqenbufmc/O5+cambFNTtr2jY3nH8q6G+lsfY9fGJqbvzM4vZJva2ju7e/raCnn23PUbY7du38nNNzQ1Nbd2Le/q6U16Y2duevrOzMzM3dm53Nzc/EI+v5DJZrON2WxbW3t7W/uKrvQ+ldNj4+Pjd+dm5/LZxta2ZZ1dq1a1VGg1zU9OT01PT93Nzedy8/mmpqambPvyzuWdncskRccr4ObpnRV89YnR0dHRu1/5gMx/af2u6u3tXVk/37rmLgxd/u+FkcvNjF/JZDLdG7asiff3bPTC0I2/XsRyYXY2k7mWyWSyq/s39yUxcbnJycnJyenpRU4CzuW+/F/Lu7t7+rsTXzbDly5P/u0VM7O3MplMJtOzbmCgzG+Q3I3R0dGx/Fcmbu6//9nR19e3Wph0vNwqdrmsuctDl6JPRMpdvZrJtAxs3NBemSn8ReDxf0702dc+u5BbZLDx8U+X7xrsCE3rnZMnJxbdcBwZOdy5bbCrlG3PsZtjY2O34n+9upzJtK7pX9eX3Jq4cvxcfvHNkJuftWwe7E92zUUYHxoayUd+Zzh/PtO4bssm2+U6Xt69Gkf3VeBVZ8+cv5KPN+S5cw2rN++81z8Xlz9c+tChqQ8/3vXg8qhnTx4+Pb/0o7cOf7Jtf09R256jo6Oj4/nCn3h3aCizfMuW/kT2YRw/Nh71Bjl1queBbeXYKB89NTQZZ7j85ctvrdm2s0VcdLx8Ph4s+xtu9NiZXAGDL1y79sHmPevu4XUw9s5wdBmOn9r34JJv9zsfHQ+kduHMme2PtxU2TdNXR67eyJcwU1Offrps956Sv0udOTQVGuTmmx8+uiXlVZQ7c/x6AYNfvfr+zr0r1EXHy+Xu4QPlfcFzn1wv+Dn5c+dW3D94j+4qz39wJNjL+Y/Pfm/14g+dOHg3Tg4vPbaroKn61wTm7PaHh7fvW1nKGK6+MxpnsMnX1j6VZjWnD58u9Oqgc0ePbnx4tb7oeJl8dl9HGV/t8qHR4p448faRb227JzfGX78ZK1W/efT+xQrz5nDMv9d/uvR0+T8x8ydPbnus6PdX/qOP495+8Mq/H7g/rZmYOXx0vpjnDQ3tPGBHuY6XR+7Dp8r2WtcPDhf/5MnXP3l0/T23+M/9aS5m1N79/Jlv7AIb+uNM/FeafG55BWbw7MWH9hX3TWryjWsF/MV49/On21L5fBw5UvSV+k+d279PpgKcB5SMsl0ua/7gC8MljWD0P+NGr2Z89If4czT0n18PyuHfzxSy+F6YrMQs5g79+81invf5r64VNPzQC2MpTP2Vf/+ghBuu5D741Q2F0fFyKNflskZ//clCqeM4+W9X7qll/3ZB1w6+/tWQL/zpUGEL9PZLUxWZy/EXirir9+mXC+3n5G+Gk57y3Lu/LfFv3/ivP5UYHU9MxMkk5blc1kcv3ExgLFO/fS9/76yUPx8rbPivhHz+tZMFL72XZioyn7k33yl0rR1+s/D1PPvyxWSn+/qvSo9w/t2XZzLoeDKiztssw+Wy5v/wQUL9PfLKPXNj0bdPFByWN/7Wh9cvFP6Kk29WaFaP/rGwrw4fFfUlcf61REN+9sXxJEZzqTL7s3T8XvRIxHmbIxfTfvWZl84lNq7LL07dG6vko2OFP2foyF//9eaFYl7z0uEKzeyZPxcy9LEi71WV/8PlBNfP6/PJjGjyN6MZdDwJHXsjHnx/Id0XH38hyV03N1+4Jz4WZ4tq1aEvjr4/eLa4V33/eoVm9+Q78Yc9906xrzL/WlK/K+bfTO6+h3d+ezmDjidhf2tEGU+n+tKTv032i+Xtl+6BgwBu/Km4vLw+l8lkMic+KfJlF96p1AwfPRV3yJE3it+umHt5OpmMv5rkZ2LuFSHX8US07o948IP5FF95+qU7CY9x9nc1v8dx7rVccU+cPJLJZEaLr/G1k5Wa5Xcm4g0383opP6XcfjWJ9/LCm8lemj//2vUMOp6AvRHn1U0dTe91Z36X/P7sO/95u8bXxttF/yU6cicz+1oJrTqUq9Asz8Xs8xulbVFfT+Ibx1tnk575V/zYqeNJyD4S8eDHqR0Ekns5jdMzbv2uxs8IKv5b+9xHmbdvlfDKdyq2QT56OM5QH5W6C+JE6VN68ETiM3/nd3cy6HjpdkZcsuju4bRe9d10vlDefKtu1+PxT86U9PxPFyo15Z/ESNmNDyu/hM99ksJIK3bMp47fWxqirmz42XRKH4njKc3NmZP1uh7zJR7vP3mhUlM+F6PRby9UfAFP/jmV0V4+okE6noBNERf2z31YSx+JTCaTeWfcGi1O5f4Cngj+1HniasUXz/wfUtrJeMhh5ItwIbGCHXgx4sO9rzv5F1x4I72TL3Ov/8yf8uI2DO+2FvnM9q7Orra2trbWbGM225jP52dnZ6anJ8fGYq7m/KdPRg8wc7Dyi+dgvNw2rl7d27m8NduYm52avDYS41DY/Os/Fy0dL13/pqXP3Fw49FwK21/XUpybG8f2WqXFyJ8fLPzT1tPb29v91c9cY2Pmr1fSvTly8fM4R6OceSz6Y/vx3Yovneuxjt1av2vjX+e9ubljzY7M5Jmjwb3/E0ce8u7T8QQ2yIeW3vt44eqapF9u9v2YAzasXtezoqOpeX7uzsTY8NWYR9V9uL3NKi3GucI6nu1bv3519Hefnp49s6cib6T5xTviTORLz8T+NaV13drurtbmhbm7ExNXhpP81vdOeAd9w7aHvvHlteuhBz77KHQQ1eFdHd59Ol6ylTsj9o0e/MekX+7DeFd6Wzm444sgNzW192x5KHf2eKzt+LsfPnFvrJYVm3p72lsa5qbHr5wv5sD4rk2re9pbGuZujX1+IU7SRvLx90i1bNq6PtZHrWXvfSffD26SHo/s+JGYx7Zv2r3hiwt4ZttWZO7PD51I7LSdU+G3Xs9TfYv+uXtg+xuByyrn3n9ahHS8dI+cXfqTMnJxU7IvNhHrG+ryb+34+prdteviwfEYTz2+Z2Xtr5LGbff3frGN2dqz9fGzBws8cqhhy76+vz6/d0fus4/DR9bnrsW8lX3jlh0D8ZPfMLjpzdDB39cnuyL+MMc7HW3tt3u/NpmbN197bySRtTEXvtDi7ieWWiQdP3r3s8Bfifvcs1PHS9dxX8ShsYc2NiT6Yh/H2WO688nFVuSmgfdifKbzHz9T82uk7zurvtLC7RteL+hEmK9tHDbt3/Jq+MSrkVgd79q9q8AdV+0/+FPoBKdL90X8XY5zclfjgX2LLcZ//OT9JK6MfDT4fejxiF9lGh5vC1xd68MfiNDX1qdFUIQHIw5VGDuV6EvdiXFuc8N3lrj7b/aJZ2Ks4HO1fnp+Zu9PVn3t/7R+f20Bz9/5s69/x1/xo/Ct4+PcVanvB//XAwX//tD4d+tCHY/aWo3xCi0/2rf4Aw/8qKX01ZH/LDTEd6J/XH/ovuinD01k0PGSteyP2lhI9HJZx8Nja3hm95KPbf/78BrOH6vx1fHY49/8CpT9XvzDAh94+pvXlW9/Nht6WvjWTP3P/3RjUZ/KZwI1HV76XXF1PDz+1h8v+VWi/0etJa+Ps6ENg/27Q5vrga86RzPoeAIbgOW6XFacxn57W8SDm58Mj+DYfE2vjIcW3bZcdn/c5+9+dLH/27Mv9Lzp4A6MfxwocpaWPRj9eO5KKZvjjc+uWvrB3mdLbkLoPm7rDoQ3TaJ3+J6czaDjJSvb5bJi7PPYGf0ddXBPcAwzZ2t5XWxcYl3sifne7lvieJ0Hgr8djaU3U7sDL77k9XbmY6zLb0futln3WInTfiVwClDz0+FxLN8f+fDcqQw6XrpyXS4rfCe3jsdDex06E3iV6tW+VBXa1sV6ftP3lvgMtOwIPXU8vblq2RD9+JInPo6ENyLWB/Y+711X2rSHLkD24PIYI9nXes++Y3W8epTpclm58FEXT4Z+mGoK71n5vIavX/vokj8jro/1/P1L/pnbFnpqmrc4Lbbjl8If+adCQzxVUhUWLkQ/Hm+HV1P0LvSrrl+r40koz+WyLgVP6VgTPlx9Q/DQjflLNbseencu+VCswwI7HljyobXNgeemeZxP4Jj+yaXeGOE//HuC38+6dpcy5SOBxN6XjTWaHSX9sdBxYm4HRjx2Mqlv3OeDQzwSYywPB4eo3U/F/qUfWhXn+fcvXZWG0CUW0twm7Aps9C5xsMzt4EE02QfDL/5gY3rv2caYfyRWrijxk6HjxBC1IbxwKJnXWAieKN0dZ+fBup7QEEMLNboWurZEfDUP/zCQaYmqSuiswTS3x0PfBZbYpzMcHPGW9vCLL9tawpQHtgk2xD2cPvpb5HAug44n4EDEeZsXkrkAdPhKpvE2bnaFBpgdq9GVsDPq5Nnu8PO3RvUydL2CmRRnLHSwzBI/wYSvFrsnzqvvKX7CpwK/GsT+E9EX+WjeZch1PBErd0Y8mMwVoINXG2rYHms8OxpKfqUqFTn/HSU+P7BvI1PJTcIlOh68gHdHrF8N+pcVPWGhLZj1cUfUdW++Y3W82jwSsc00crEsHV/dHms8bcHrCl2vzVWwKvLDHj6+rW1tKc+v5OlTt4vseMyruG1K6z3bHfsvRKeOJ/f1jYhNm9QvlxWsa9yzvjdey9yTn4rojbtwMtZFrqTQH8niOz4zNTV1e/bu3dm78/n5fD5f+M8Ti2+PTwd39WyIN/oNRd8RNvBOin+lwlYd1/GyePDE0jdeGTu1q+Tx54J7reNeDCo43FiuJt8JA6WUIPj8hua5xDt+6+bNG2O3St8js/g7L/wzR8zbnBR9N5TQfutVsccUeENO3WnPoOMJaNkfsRv8w+3ZUsc/GbqGaEPcrZvVDYEtvvxkTy2ugdUldrwvsIKjO17oJV5vDg9fSeqWa4v/JQiembQi5tEi7V2TRb5nA3/c3nsvqXU/qeM6noy9EWduTn32QKmjD34qV8ZdfU0rQ8cVT9VixztbS+t4U+CIlGxyk5ofPnsxyeNbFs9l8ETi2Gu5ZzKl92xibq3JoONJyD7yp6UfPLy71Es53woN0B17VN03q+bzl6BVJb65ewK/YSR2FMD1E+cTPkixyI6viDv+FWm9ZxMzlUHHk7HzyNJ7JO8ePpD2OzX+h63rnvxUdJX45g4tlYTu7HTxyJXEZz1XXMdj/+XvLnK6dLwiHHdYknQvlxV8p3bFHtWKe/JT0ZlyxxNx6Ze/Tz7jS2yPB88wjX3U37K03rOJuZVBxxOS6uWyppP7sLVXz+cvQYEDvIO7t0Mn7idwtYLJ3788nsasLxSwlf4lbYm9YSr+PprJoONJSfNyWbOJfSrDH8uavHJtYP4bSl0qpZ/oc+zfLpZzgcyX/D4o/K1VqfeRC6zoeHLWbI7YZjqU8qcy/oet7Z78VLSm3PFSo5R74+3ynvMZXIvNccfUnNYU6LiOV6MUL5cVfKfGPyAm+LGsyVt0lro9HvrrVuIN+u68cKbMCySX2Oc9m9YU6LiOV6Pu9C6XldynMvyxrMlPRbbEjof+uuVLmro7L90s9wKZL/l9UGoYdFzHa1N6l8vKJfapDK/nXD2+e7NpTtzMS+W/GHBDxcek4zpemzqiblt7qJRDHuaTW3uNJb+Wjhdm4Y0KXNM9OEP5xN57FX8f1eqtT3S8Sj0Y8XPb2Kmq+FSGh8zW4pJvqOJ3/8eXK7BAgmsxdmbn05oCdLw6teyPePDDEjZQmpL7sOVLfi0KMvJhJV41uBZj74zIpTUF6HiV2htxPsrUZyl+KuNvj8/7/JXXXyrytT+4NRz7cot30nrPouNVKht1Q/rDxR+8FvxMxB/1XMkFoBCnKnP7yODhpbHzPJPWexYdr1Y7I65/evfj9Lau4n/YZnz+yin/fmVed1li75jbRU6B91FFWOxJaDjw+6UfPLq32NG2JPapDA/ZbC0m6ELcS6StXNXT2dna2tT4jQ2qXxTzusE7ksa+qvh4Wt8I0PGqtal/ZMnHir9cVvB+7/E3mm6X/FoUINbdLRs3bFuf8D1tgmtxIu6YJtKaAnS8ej36m6UfO1nsSJPbugp/LDutw+RMfh6j4nvvT755wTHG3swu9lRU7yMdr2FrNl9Y8rGij1wIdjz+RtNkya9FfBdivGG+m8bFz4Nr8UY+3i9iMxMpTcH/bvX2SIHfORNyoCH5cQa3bWJvXYWH1PEEhTfHB38cyHhxx28Hb7+Zi7mdfTWt96y7P+h4NeveVYGtq7G4n/bcWMmvRWz5kdAQO54KffCK63hb8ICVmLcmupRWxye8PXS8mj2c/C6qrtDaWbgec0zXQ/t2GruswcSMho7W734qOI4iz8NZFRog5oXbir6+W2fgPXvD20PHq1nk5bKK07Qyoa2r8HAr/VCSnOCXn2+Hz7oqcv9DsOMjsc7oHCn61rLZwK6da94eOl7VHkz+F5zVoQGGYo4oOFyf9Zec0L6DlRsS+FtQ5DsmfzrOaI4XP/OBd9K1vPeHjlezyMtlpfKZyGSux/v6PXO95M8/8YUODtoaYxxF/tC4Lvhz+4kYY7lzrviZXxP9cG7Y+0PHq9rexH8rDHZ8Id6Nw84slPxKJNfx/vAoFkaKe+nW4B/kmzG+w308n9579oL3h45XtcjLZRVlZfDM/BOxxhMcqmWl1Zec0OXLusOjuFLsdaoGgkOEL/1y61gJM78icNPTs/PeIDpe1XYmXcOGjaEhxmKcOZgZDh40vLHB2ktO6JjBtvAoir5Bc3jX+43gzu+3StqHvSn64btnvUF0vKo1HEh6jJuDQ3wQYywfJvA6xDdX8odupuiO9wWPIM+8NxX9+LHS7mS0JfD4J27IpuPVbVN/wiPcGDxA7Wr4SN9LwaMOsxusuzJujwcvBp/5tOibCDdsD/+ZeTVy7Ff+UtrcDwR2Bo6dLnX5jrzkPabjaXo04fE1hXd3vh2qQu7t4DjWu9poOT9UU6ERTB0p/sV3hgcZfT1ix8nN10o8MrAxsGMlc+huSeO/9rsXHfOi46lasznhEW4LDjEd2nx6L3xKyVZrLtG/voHHg+c0vl3Cb4E9veFhLr6y5Bb51Rdn0n7P3n6nhJGPvvLCZe8wHU9Z0pfL2hq+QPXJ6DuAnggffNC2zYpLUujbTShEnw2V8uqDMYa5/Osl/pZ8+tvZkmd/Q+gaD2eOFjvqoZd+NeT9peOpS/pyWY17wsO8F3UEwMXwXpXMbjfnTFToxN4L0a0cfq+kV98Z43CYzNgLhxaZiOu/fTeB0y0b7g8N8ZeiLt8yf+KXr9ijouNlkfTlsvaEG5t/Y+njw8/G2NvZeJ/VlqjQ9ujcp5F7Dl4traVN+2JF8fD/995Xz/1fuPjKr68kMv+7Qn/IFl4r/ITR8UP/+udx762lVrpFkKyOvYcTHV/7tlPBYRb+PPLkoisy/95nMV5i6zKrrawdzxzeuvSZBiOvlLpn475PYv2QePfIkRXrVq/obGnKzN2dGB8ZvpvU/DftCd1bPP/65P5Cxjh37uSI95WOl9H+43eTHd+ZGJtnp4YPLHK82dB7cTZgGvZbaclaEdwY/v1Plvrd4/RbuVJfvvn+D2IOOTFxPJUFsPdo6G/RwqHhp+JexiJ3+cK5nHeVjpdVy/6DiY6v+75PYww19cbHu3d85ets7tyxeNcI3d1jpSVrTXCIyRe/373Y/59992QCr7/v+HRlF0D7Q+Fd/Jd/+cC+GIe7zl68cEnEdbz89h6dSnR8D5+OdSTY2F/eXb1+Zfey5qb5uZmJseGRmMeutTxilSVsZVtwjU38xyP7vnFoU/7U+3cS+VA//lqlPwMnw9fdzX346Z49kdvks1evDI+6zq2OV0T24T8lu4H/yNvxBly4VsxF+h9us8qS1n8hOMj8wZO7d37lC9TUmWNJbQBs2XCpsgug8Yk4p1zOHj68Zuv6Rb8Ozt28efPaqDP4dbxydn56M9Hx7T55Pb2J7XGwSvK2XIgx0Pi7h9b0rV7R0tI8Pzc1cf3KaIIT8MS/Vfiqguu2x7tCzNWrmbbelSs7lrU3ZbPzuflc7vb09PT0+KQ3kY5XWMO3fp/s+L73H3Oprf/vOfI0eZubYu3SnR9O63Dorm+/XeFF8OS1uCmeuewEzdK/AFkEyUv6clld30ltUh934fEUNG+u9BTsKfUU3cESn9/yrE1EHa9xSV8ua/uulCZ066CVlYZ9FZ+Cp1aU9PS+J0qdgFVPeBvoeG1L/HJZT/SmMp3dT1lXqegdqPQUND9byjUsO54t/VINu3Z7H+h4bUv6cllNz3enMJXL/6HFqkpHybf4K/kbWM+zxX+2m3/QkcAyeNLl13S8tiV9uaxM2/OJ38Q50/YPHdZUWt/Idpb2/J7S90oMfLfYZ2a/vyqJZdDw3c3eCDpe29tjSf/Ks/z5pI/zbnl+hfWUmsdKWl1tzyXw/tn2eJFNeHZdQnH5+43eCDpeyzr2Jr6J/+Nkt8jbn++1mtLTVsoxRo3PdiUxDXufLGb3XtP3E6tv47PbvRN0vJbtb016jCt/tjrJPws/7bOS0rTlgaKf2vD02mSmYU8RP1e2Pr8hk8lkQqfDxwtH9plveSfoeA1reTDxUbb/eHNi41r3007rKF0Hij5m5YnEtmI3/6jQzYkVP/2vkx9CJzLFPRrmwefc+1XHa9h9yf8w2fTswwmtr73PO1IlbQ3PFXk62JN7kpuINT8vbNN+80+/+NEkdF5/7P33m3/iepo6XruyD6eQhod/0p3AaJb/w+PWe/qafljMrqvG7+5JciKW/+hA/HXd9MRzf91+D10JIv7vsD3/9LB3m47XrJ1pbIes/vm+kg9N3/E/1ls75dD8D4X/Ytj6/I6E//bvj/1LyPr/8beLpt1OrOOZxod/7reYtLcZLILUvlcnfLmsLzbzH9t6sKS7KK56dMC6KVfIv3/wSGHP6P37rsSnoven5w7FuGjVikc3f+m/QneiKGiv98qfnPg4uYvy92zZ6q2l42WzqT+Vewr2/fjSoRvFPrnzW44EK+ff8sf63p4pYPi9j2bTmIytm08cDdzYoWf/tq980Qt1vLBTyBp27zrxcSI3KVq1ZWu395WOl9Ojv0lnvBs2nPmkqJJ33b/bjrTy2rr2rQuxN1ufWpPSVDTu2TNy7PySv122bB78+m+yoUvodxU8BbuOH50obS5a1m/Y4BRkHS+3NZsvpDTm7duvHT9b4G0LGzfttkel/Nqfu3wo1i0i2h8eTPOPbH//3PCly4vsX+lZNzDwzRcObScUfthqdu/eKyeLvmFy4+q1A/02QnS8Eg5cTO3OVH193z5zbiT+zQtXb961zAqpiIGBs0eCd3TqvW97NuXpaN60KTM9NjY+MTM3N5dvzLa0Levq6uld9AjU+dD9NYvajb927RNnz18pOOVNff1r1yhVlIZ/+du/n95pedSW2ctDl2Lcmbd5YOPGdkurkq4fPze79KOtm/ZU2REdl38XGOD/Lvo8svkrly/HvvFh06rVvau7G7yBFnHqj7bH7w0tW7dmxkdHR0eXbERTT29vb4/vo5W2evWTIxeGxxb5etbYv36gt+pCFbpPc3PxZ7llBwYyd27cuHFjPPLL6rKu7u7u7k4Jj/f3ziKocd3d2zOZqVvTU9PTt3O53Pz8fGO2KduUbe9Y3tGxfIXPQZVoXLcukxsdvTU1dSc3n2tobmpuau3sXrGiqyr/yA4FHl9T2vuqfWAgk5mfmJ6+PT09k8vNz+fmM42N2cZsS2tra0t7x/KODtseOl53li+3DGrh09bfXxsTOhw6siSJ+cj2OGM/sa0EiwD4qmOhAfotIx0HqtjEhVA2nGiv40A1Oxg6ntVRgDoOVLPPQ5vjGXdQ1nEgfS+PFfnEmTeD1XChqirj+xHcky5d3v1IMTd7zr8RumZtZqDN4tVxIH0Lx848sLfgu6otvHk5OIxrZuo4UB6z7x+5f29hd/DL/fFccJhlWyxaHQfK5O4HR+7bU8C1XqdejXFtxgeyFqyOA+XbJv/4k833xbzZcv6zD2JcjLB9t6Wq40A55c+d696+PXyh2fzZw7EOcdknGjoOlNv4Bx+s3roh8nImk2dP3Io1ro49lqeOAxVw/frB9vXre1cudsZI7uqVS9fjjujJZgtTx4HKuHPmTKaxp6ezY3lHc1NTU35+Pjdz+86tsfGJ+PeVymzbZEHqOFBB+dHRkp7f9oRlWIWclw/E9qRTOXUcqGUPu7KKjgO1bNvDloGOAzWs72nLQMeBGtb7AyfkVynHqwBxrP1+i4Wg40Dt2visrXEdB2rY7ifsg9VxoHa1POWAQx0Haljf9zotBB0HajcSDzxon4qOA7Vr26PLLQQdB2pW7+P9FoKOAzVrYN+AhaDjQGX8r3Pnb5Q2huz2fSstRx0HKqX7oYcmL1wamS/y6Y1rt25xjVodByqra9++3PDl4ZsiruNA7X7AN27MzI6MXL0xG/sZa9b2r3EKvo4DVaRl48ZMZnL0xsT4ZC5quIbO7pXdPascK67jQDXq6tqayWSmb92+PX3n7t3Z2Vw+n883ZrON2WxTa3t7+7L2jhW2wnUcqHYdHZbBvch3KAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HIDFNVkEVItfBB7/5xSfXbOzfW9MAbbHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HGAetJkEVAt/tkiANvjADoOgI4DoOMA6DiAjgOg4wDoOAA6DqDjAFQf5+UXaW56+s7MzMzd2bnc3Nz8Qj6/kMlms43ZbFtbe3tb+4quJnNsttOUu3ljYvL2zN35+cbm5ubW7u6V3curdSHOT05PTU9P3c3N53Lz+aampqZs+/LO5Z2dy5RExyvy6ZmcnJycnJ6eXeSh3Jf/a3l3d09/tzk22ylYGLn0+ejCf1dyfiaTuZLJZDo3bFjXXG3L8cbo6OhY/it/Guf++58dfX19q0VIx8u4TTF2c2xs7FbcwaemLmcyrWv61/UV8Bq/Go18uP3/KXA/2Oz/mY98vPefKj3HX/aLwOP/fO+s6JLcPH7uzqIP3Dp2rHHLnrXV85kZHxoayUcNMH3+fKZx3ZZNtst1vAzbFKOjo6Pj+cKfeHdoKLN8y5b+uMPviu74nc83FPb656Mznhms+BzX6YouwdDhkYhH82fP9uwZrIqfvUZPDU3GGS5/+fJba7btbNEZHU/P9NWRqzfyJYxg6tNPl+3e0x5r2B0Hc5GPny6w46cDa397xee4Tld00YbfGw1urr995NEtFf+LeOb49QIGv3r1/Z17V6iNjqflXxMYx+0PD2/ftzLGgC1bost7IVfQCrt9JfrxrS0Vn+M6XdHFjv+d83EGm3xt7eOrKvo38fDp2QKfMnf06MaHV+uNjlez+ZMntz3WER5uMLrjufM7CnnVMwuBV6uCOa7TFV2UU3+JW8crvz6wr2LLYObw0flinjc0tPOAHeU6Xt3OXnxoX3C/5doVE5GPny6o44HdKt39VTDHdbqiizD39un4A+ff+/zpyuzZyh05Mlvsc0+d279PkorgPKAyvsEP/fvN4EC7oh/+/E4BLzh+o6TXKtMc1+mKLtit35wuaPhL/zFaiZm/8u8fzJaw6D741Q2l0PHqNv5C8KO4K3qNLJxNbnO8cWdVzHGdruhCXft1oX8bbv92uPx/wt797WSJi+7XnwqFjlf5ltqb7wSOiGjfWFKbv+JM9MOb2qtijut0RRfo8/+cKfg5cy+fL/NsX/9V6RHOv/vyjFLoeHU7+sfSfnu8PhH7pUZulfRKZZvjOl3RBbn8ylwRz5r/w9myzvPZF8eTGM2lFyaFQser25k/Rz++oSOpDfLA5vjygSqZ4zpd0YW48mpRB4BkFt4s566Vj16fT2ZEk78ZFQodr24n34l8uGFXSXX+0vfTc9GP72qokjmu0xVdgJu/zxX5zPyrZfuhOf/mB4mN685vLwuFjlf5N+5T0X0NbKtcjfvtdKakvxdlnOM6XdGx3X65+CNAZl+eLlPGX03yp925V4Rcx6vcO5H7uDvXRz877sclMNz65VUzx3W6ouOaf7WUFE+/UZafJxbeHEr2z8Jr14VCx6va3OuRxzIEfn88F+9AiLnA52qwiua4Tld03L8G10p6+pWPyzGrbyX9i+rcK37s1PHqNno46tHNbZFPnon3jfN89C7Vts1VNMd1uqJjOlHi8z8cSX9GD55IfJR3fncng45Xs0+i3qLZ7dFPjrdjJTDUzsYqmuM6XdFlsvDGXNovce6TFEY6+aZQ6Hh1f+H+MOrRwC6Pi3E+lrcDB5wNVtUc1+mKLpOpj1J+gcl0jiy9fEQpdLyqnYj6Bawn+s4yuThn6QUudVj++6+dmLCiK+XTdCdi/g+z6Yz4kMPIY3JxseK0d3V2tbW1tbVmG7PZxnw+Pzs7Mz09OTYW8x2d//TJqI3l6F+2Tse4MMqZpDfH053jOl3RZZL/yw/THP3BeLltXL26t3N5a7YxNzs1eW0kxvWw8q//XKB0PJ0l1tPb29v91eXW2Jj56x0Zbo5c/DzOQQpnHotY9Nvejdx1Mnw7eJXm8eiPVsvWKpvjOl3R5XJpaGN6I79+NM5Q63dt/Ouia27uWLMjM3nmaPDHg4kjDymOjict27d+/eroXVE9PXtmTx0bD45q9kzEJnHztsif/xfOBO8REPiVc3tTlc1xna7oIjSvW9u9orW5YW52cmIk9mWMP0qx4++ED1Bv2PZQ99f/X9dDD3z2UeinnsO7OmRHx5PUsmnr+liLq2XvfSffD37Ajkd9vAejD+MKdzyR3SrlnOM6XdGFWr978xd/XlpbO9fvyVw5dj7WIerXhteltbhOhQ9v73lq0V98sg9sfyNw58Hc+08rj44npnHLjoH4vwk3DG56M3SU9/XJrqUf7OuJvCzG6FjgHpCBSx2u6q26Oa7TFV2Y3se/fgentWvH34t1IuXhtDo+dyg4yO4nllqiHT9697PAX4n73LMzztvWIoih69H/93sbC1pU7T8I3oDtUtSDu0rabRLaHN9dhXNcpyu6AA0P/WyRG/F1/+Dv4myMXU7r0I+jt0NDPP6dpZdow+OPBJ5dn8er2h5PXt9DRexcbPy76cAR3Jfui3hwx6HIS4CeORA56sClDpu2V+Ec1+mKji/77BJTt6s3zj0mjn8nlWWW/yw0xHeitxoeuhP9M+nQxAoJsj1esv7nf1rUb0SNz7REDzAcVeq2TZHPnYo+1TpwqcMtLVU4x3W6ouNvcf1gyalb9eMYd3Y6l84Vbs6GNsf3h778PR642/fRDDpesn8s9nYLyx6MfjwX+RNP4Mex6B0rpf3KWaE5rtMVHddTEZfBXPls+HN892IqSy10H7d1B0JjaHgmeqfAydkMOl45uwM7rSIvzDnQWfzW1Vz0R3bF2qqc4zpd0THti9wX1v9YeAyp3PD6SmC3e/PT4XEs3x/58Fx9Xrxex6tFy4box6NPaIv+pfNu1EEKgUsdDlbpHNfpio5lxbeiH9/bHxzFUBrbtaG7Uz0Y5yr3+1qjt1mkRMcrqbSONxS9dRX94WrcWaVzXKcrOpbvZEMDBO/Sl0/hVp0LF6IfX3Z/nLE0Re9Cv+r6tTpeSYGDvCcjN5s7NhS7dXX788hnbmyv0jmu0xUdx0Dw6O+V24Ij+Tz5GR8JJPa+bKzR7CjpjwU6nqrA+R8L0bfAjd79Mb/0t82zCyWMt5JzXKcrOoaHkhgkhY4HrrzZuDveaFauKOVV0PFUNQcenyplu3npnSfRP2gt31C1c1ynKzqsN7z3O9Md3GQfT/6Oy4Et5Q1tMccT/cv7cC6DjldM6CSr6M9VYD/28FLPDlzqcGdD1c5xna7osFhfoXYFh0j8sM+pwB+o2FfVjL7gft5lyHW8ik2X9Ok9U/CGeiaTyTQMVvEc1+mKDmnYFmeoLcF90Yn/zHw18Pj6uCMK7Ji6phU6Xr0Cp8IFjvM+XVTH1y+v4jmu0xUdsqY11peC4GkBiXc80NfuZXFH1Knj6X4jZEkzU1NTt2fv3p29O5+fz+fzCwWPIbSZNhj5RfjmzZ5Ft5EmS/+KXrE5rtMVHRDzcgEbQ1deTPxX5kBf41+psFXHdbzsbt28eWPsVuk/vtwNfVN+J/LUjdOPFrKZ/l/aNlf1HNfpig7ojzfYmuDXgpm2RBdPaL/1qqQyNHWnPYOOJ+jm8PCVpGoUCkTT9mNRD59ZrOOBSx3ubKzqOa7TFR2tsTfecKsaQ5fCupnsRcgnAxcAe++9xF5Jx3U8ue2P4bMXZxIcX/A6eIORHZ9e7B4vl6MncLDK57hOV3SklTE/pI09oeM6Et6tVb6jSG+tyaDjibh+4vxMsmMMfrx7eyM/mWcW6Xj0bpX+7iqf4zpd0ZFir7PuMnf8VtlWyT163oGOl93FI8lfdDX8dXvw7ahHzz3xjUPNApc6HKz6Oa7TFR0l9n0UgvePS/hwIR3X8dpy6d3xFMYa3kzb/l5UAmaHtnz9f12ITEbL1qqf4zpd0SXlOfaAtbtfRYJ0vGST76ZzDf7wAWwtWyL3k5z+Rsejd6tsa6r6Oa7TFR0l9m98wcO1E94eL1/HZzLoeImOvVu5zcjByDAP3f3agbd3oq+FNFgDc1ynKzqJjgdPF0r4CuRzZVsELrCi46W+hf58poKvvnbFRMSj+XNfu6Bc9KUOV62ugTmu0xUdoS2xARP+M1W+uup4gPPyA+68UNlPd/Qm9OnAfxezOV7pOa7TFb205sQGTDiHOq7jtfLpfqnCl8yOPnFn5Ku7KCci7wSZ3VETc1ynKzqBz2jwQlm2x3W8Ls28NFbhKWjfWMAGefTm+NaWmpjjOl3RJeQ59ofZ9riO16OFNyr/6Y7eGXIm4r8KG1P1zHGdrujSP6PBAfPJTlj5fhVeyKDjRfv4cuWnYUNH1KNjXz6F71rkpQ5XrK2ROa7TFV16ffNl/rRnFULHa8DIh1UwEQ27Ym+QR+9W2VUrc1ynK7r0zd5gxxM+Os3BbjpeC/5SFV/nAh3/2zTmz0au6Z01M8d1uqJL3h4PBj/hDWgd1/EacKo6bgvYGXl3rNvD//3P6EsdblxWM3Ncpyt6KXOJDWh7XMfrTv79KpmQuIeQl/wrZ9XMcZ2u6CXMJDag7fF7lVWxpAtxryq0clVPZ2dra1PjN/4o/iKRCdnSFvUBPf/kF+swdyFqJB0bamiO63RFL+FO3AGDt71oSXbCmkVCx6ve8VjfZzZsW5/2vUoad3wa9WX64hd3Uz8feZDtroYamuM6XdGldjx4GaxlyU5Yh0joeLWb/DzGh3vv/eV4Lw9GdTxz+ouOR+9W2VVTc1ynK3qJCUxswITnoVMldLzqv22HB1nz3a6yTMrKvqgbhl/+r7vnRl/qcKCzpua4Tld02h1PeHt8eeDx/92aQccrK7yVNvhk4FfixM4mHozqeP7cnkwmkzkbeXjaYI3NcZ2u6EXFPtV0osq2x2/peLk4XmWpOo6EhtjxVGjhJfbx3hb5i9J/HbESuVulbXONzXGdrujFOx5z9Pnglb7K3PGJDDpeWaOhg3G7nwqO405SE9O8LerRq5OZTGbiWmSKGmtsjut0RS/e5xvxhrsRPA+oJ+GOB95VNzLoeGUFv8x+O3wwbnJ3FQxfLKv0S2RV1xzX6YpeVMwbP18NDbCsLdnpygb+LlyTER2vsNB3wpUbEkhEbH09JXV8zcqam+M6XdGLGkposJ6kJ6wv0PF8Bh2vqNBv/3HuPH81ucmJPGxw/Hrm2kSpm+PVNsd1uqIXHf3dOEPlgpvtq5KesDWBKRrWER2v7o93f3gUCyPJTc6OyC/3p6M3x6N3r1fpHNfpil50/GfjDHUhuHs88Y73hSZJR3S8skK3Fu8Oj+LKTHKTE33Aydn5yE/69qYanOM6XdGLOhFnoJPBIdYmPV0rAjvcz85n0PFKCh3rFeMno0Tv2xu5a+TOwTtFP7dq57hOV/RiRmPsuBkPHgffnfwpqZuiH757NoOOV9JcyQtuJtGP9/rIg3U/i3qwZ3VNznGdruhFxbjPxcfht1Dy07Ul8Pgnbsim41W9mRa+KPSnyZ4dsqvoZw7W6BzX6YpezOXgb5jj4T8mKXR8IHAFxbHTpb7CyEtapOPpLZip0AimjiQ7QXEuWLio7I4aneM6XdGLeiu0p/mt4JZv47oUFl5gx0rm0N2Sxn/tdy865kXHSxD6aTB4rtrbCf/GE+cC4ot/922t0Tmu0xW9+Ob2B9GPHwufK7SxJYXpCh0JdfudEkY++soL9Xnbbx1PTOga+aE32GdDSU/RYMrPq745rtMVvahPzkVut/4lPIYdaUzWhtCFIM8cLXbUQy/9aiiDjpcktBF7Ifp4teH3Ep+ijcVddbRrXc3OcZ2u6MX9MWIHw/ir4TMnWzemMVUN94eG+MvFYsY7f+KXr9ijouMlC21nzEXe22H01eRPSW4sboNqsHbnuE5X9OJyr1xa6qGbv70dfv7WbCqTtSv0d3DhtXMFj3T80L/+eVyDdDz9j3fmcMRFNUZemk1hkorasdK4s4bnuE5X9FIh/2jx3zJPvRDneou705mqpj2hIfKvHy5ojHMnX/zl4ZkMOp6AFcFvfr9f8tNz+nepfLpXFHM+Xvy9MVU4x3W6opfasv3ghUUuADDx+z/GOe5xoDelqdob/Pl04dDvpuKOLXfhj//nTyMZCv1zahEsbk1wiMkXv9+92P+fffdkStM0eKWI59T0HNfpil7K9RcH9mz8yqbXyLFz8Xbs7E9rmtofCv9CcPmXD+xrDo9q9uKFS7kMOp6clW3Br3YT//HIvm8c1J0/9X5qdxXY8k7Bm38FHK1YjXNcpys6ooiXW9b1r1zR0twwNzc5fvXz2zGf17cutUnaezJ82d7ch5/u2RN5O8/Zq1eGR13nVseT1n8hOMj8wZO7d37ld56pM8emUlxZ248V+pSdDTU9x3W6oiODd+FCEc96KL0JanwizimXs4cPr9m6ftEroM/dvHnz2qgz+HU8lY3fOB+X8XcPrelbvaKlpXl+bmri+pXRdKdpd8EdH6zxOa7TFZ20gY0pjnzd9ngXmLl6NdPWu3Jlx7L2pmx2Pjefy92enp6eHp8UGx1PzeamWLvq5ofLeJjrqt4C+7G+s8bnuE5XdOKbzKmO/slrcVM8c9kJmumsYYtgCc2bq3CiBtMcvirnuE5XdLLuX5Hq6FuetTmo49VqXxVO0/bCPjBtm2t+jut0RSdq+UMpv8CqJzLoeHXqHai+aWrZWtDgO7I1P8d1uqKT1PBMc9ovsWt3Bh2vTg+X/O5OfpoGUxy6Oue4Tld0CWvxG7PXn/4ifHJbBh2vSmt2lvb8nhS+bfZ3FzBw38p7YI7rdEV/yROrS3r62gfLsc3/3c2CoePV6bG2Up7d9lwav/4Usuk3eE/McZ2u6L/JPlfKjTU7nmkoxyJs/PuNGXS8GrV9p5Ql+2xXGtO0M/4aa952T8xxna7oL6f4h8XfAqLlhx3lWYaNz25XDB2vSlseKP6L5tNrU5mk9vibPdua74k5rtMV/WU9RW/xNz7XU65lmH3mW4qh41XpQNGHMjyR1tbJYApDVvcc1+mK/rJ1zxb3QW347royLsQHn2vOoOPVp+G5In/rf3JPWpO0YXncjbi+e2SO63RFf3Wt/6CYLfLs98p7GMnmn/Rk0PHq0/TDYmrY+N30Pt0NcQ+uGLxX5rhOV/RXDfyo8N9im3+4tcxLseefHlYUHa9Czf9Q+O/wrc/vSHGKBuMdf5Ddcc/McZ2u6K/q+1mhR5Eu+/G6si/Fxod/3icaOl6Fn+/vF3redu/PUv38LF8fa7AtrffMHNfpiv6azp8Wtid+w897K7EYV/7kO8uTG1vPw/9TguJ8nbQIQhoe63u7kNsF7n00m+4EDca6ZtzgPTTHdbqiv/6H5pmBv8S+kUjjgUpdNqZh964TH08nMaZVW7Z264+OJ2Xr2rcuxN4ceWpN2pOzuS1GbbrW3UNzXKcr+ht2rn8n5vT1P95bucXYuGfX8aMTpY2jZf2GDR0ZdDxB7c9dPhTryt/tDw+mv6eqccen4YF23UtzXKcr+ps6nht+L8b0dR3YWtnlmN2798rJc8Xea7Nx9dqBfnt8dTx5AwNnj1wPDdR73/ayfNMeDHe8Ydc9Ncd1uqIXse6fLh6+GvimcF81/Gldu/aJs+evFJzypr7+tWtUqVAN//K3fz+90/KIcv34uYjdk62b9vSZY7NdBjdOnFvyFs+Nm++rotNq569cvnwzdsJXre5d3d2QIZ5Tf9Tx4uRHLgyPLXJD2Mb+9QO9DebYbJfJwpVLw4vcmbhzYMP6qjul8s6NGzdujEfeRnlZV3d3d3enhBfdcd9gCtG4bl0mNzp6a2rqTm4+19Dc1NzU2tm9YkVXozk22+X8Gr1uXSZ348bEremZu/P5hpbm5tYV3StXLq/GZdk+MJDJzE9MT9+enp7J5ebnc/OZxsZsY7altbW1pb1jeUeHfeGl0vGCl1h/vzk221UwfWtq6DihbI8z9lPd8LAIAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBxAxy0CAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQfQcYsAQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0HQMcBdBwAHQdAxwF03CIA0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcB0HEAHQdAxwHQcQAdtwgAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HAAdB9BxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAdBxAxwHQcQB0HEDHLQIAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB0DHAXQcAB0HQMcBdBwAHQdAxwHQcQAdB0DHAdBxAHQcQMcB0HEAdBwAHQfQcQB0HAAdB9BxiwBAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0H0HEAdBwAHQdAxwF0HAAdB0DHAdBxAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxAHQcAB0HuGc1fenfIxYHQE0YWaLjJ05YNgC1xn4VAB0HQMcB0HEAHQdAxwHQcQB0HEDHAdBxANL1/wM3WHR5oeXfGQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0wN1QwMToxNTo0MSswMDowMKOdORsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMDdUMDE6MTU6NDErMDA6MDDSwIGnAAAAAElFTkSuQmCC";

const CountryReports = ({
                            onLoadDocuments,
                            onLoadCategories,
                            onLoadImages,
                            onLoadCrops,
                            crops,
                            documents,
                            loading,
                            error,
                            images,
                            "data-description": description,
                            "data-country": country,
                            categoriesWP,
                            selectedCountry: selectedCountryId,
                            "data-year": year,
                            "data-image": image,
                            editing,
                            "data-width": width,
                            "data-height": height,
                            "data-category-sufix": categorySufix
                        }) => {

    const categorySufix_ = categorySufix || '';

    useEffect(() => {
        onLoadCategories()
    }, [onLoadCategories]);

    useEffect(() => {
        if (categoriesWP && !loading) {
            const params = {};
            params.per_page = DOCUMENTS_PER_PAGE;
            onLoadDocuments({params})
        }
    }, [categoriesWP, onLoadDocuments]);

    useEffect(() => {
        if (categoriesWP && country && year) {
            const year_ = categoriesWP.find(i => i.id === Number(year)).name;
            const country_ = categoriesWP.find(i => i.id === Number(country)).name;
            const params = {country: country_, year: year_};
            onLoadCrops({params});
        }
    }, [onLoadCrops, categoriesWP, country, year]);

    useEffect(() => {
        const params = {};
        params.per_page = DOCUMENTS_PER_PAGE;
        onLoadImages({params})
    }, [onLoadImages]);

    const generateLinks = () => {
        if (documents && categoriesWP) {
            const docs = documents.filter(d => d.mime_type === 'application/pdf'
                && d.categories.find(i => i === Number(year))
                && d.categories.find(i => i === Number(country)));
            if (docs.length === 0) {
                return null;
            }
            const langsCat = categoriesWP.find(i => i.name === 'languages');
            const enLang = categoriesWP.find(i => i.name === 'en' && i.parent === langsCat.id);
            const frLang = categoriesWP.find(i => i.name === 'fr' && i.parent === langsCat.id);
            const links = [];
            docs.filter(i => i.categories.find(j => j === enLang.id)).forEach(i => {
                links.push({lang: 'English', link: i.source_url});
            });
            docs.filter(i => i.categories.find(j => j === frLang.id)).forEach(i => {
                links.push({lang: 'French', link: i.source_url});
            });
            if (links.length === 1) {
                return (<div className="links-container">
                    <a href={links[0].link}>View Report</a>
                </div>);
            } else {
                return (<div className="links-container">
                    <span>View Report -</span>
                    {links.map((i, index) => {
                        return <a key={i.link} href={i.link}>{i.lang}{index === 0 ? '  /  ' : ''}</a>
                    })}
                </div>);
            }
        }
        return null;
    }

    const generateCrops = () => {
        if (crops && categoriesWP) {
            const year_ = categoriesWP.find(i => i.id === Number(year)).name;
            const country_ = categoriesWP.find(i => i.id === Number(country)).name;
            const crops_ = crops.find(i => i.country.toLowerCase() + categorySufix_ === country_.toLowerCase() && i.year === year_);
            if (crops_ && (crops_.crop1 || crops_.crop2 || crops_.crop3 || crops_.crop4)) {
                const data = [crops_.crop1 || '', crops_.crop2 || '', crops_.crop3 || '', crops_.crop4 || ''];
                return <CropsLegend data={data}/>;
            }
        }
        return <span>No crops data</span>;
    }

    const generateImage = () => {
        if (image && images) {
            const source = images.find(i => i.id === Number(image));
            if (source) {
                return (<img src={source.source_url}/>);
            } else {
                return (<img src={NO_IMAGE}/>);
            }
        } else {
            return (<img src={NO_IMAGE}/>);
        }
    }

    const classes = 'styles reports';
    let childComponent = null;

    if (loading || !categoriesWP) {
        childComponent = (<div>Loading...</div>);
    } else if (year && country) {
        const year_ = categoriesWP.find(i => i.id === Number(year));
        const country_ = categoriesWP.find(i => i.id === Number(country));
        if (!country_ || !year_) {
            childComponent = <div className="error">ERROR: Wrong country or year.</div>
        } else {
            childComponent = (<div className="box" style={{width: width + 'px', height: height + 'px'}}>
                <Grid>
                    <GridRow>
                        <GridColumn width={5}>
                            <div className="image">
                                {generateImage()}
                            </div>
                        </GridColumn>
                        <GridColumn width={11}>
                            <div>
                                <div className="crops">
                                    {generateCrops()}
                                </div>
                                <div className="report-container">
                                    <span className="title">{country_.name.replace(categorySufix_, '') + ' ' + year_.name + ' Report'}</span>
                                    <span className="description">{description}</span>
                                    <span className="links">{generateLinks()}</span>
                                </div>
                            </div>
                        </GridColumn>
                    </GridRow>
                </Grid>
            </div>);
        }
    } else {
        childComponent = (<div>Please select Country, Year and Language to show the component preview.</div>);
    }

    return <Container fluid={true} className={classes}>{childComponent}</Container>
}

const mapStateToProps = (state, ownProps) => {
    return {
        documents: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'data']),
        loading: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'loading']),
        error: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_DOCUMENTS, 'error']),
        categoriesWP: state.getIn([DATA, WP_CATEGORIES]),
        selectedCountry: state.getIn([DATA, 'filters', SELECTED_COUNTRY]),
        images: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_IMAGES, 'data']),
        crops: state.getIn([DATA, ownProps[DATA_CATEGORY], WP_CROPS, 'data']),
    }
}

const mapActionCreators = {
    onLoadDocuments: getDocuments, onLoadCategories: getWpCategories, onLoadImages: getImages, onLoadCrops: getCrops,
};

export default connect(mapStateToProps, mapActionCreators)(CountryReports)
