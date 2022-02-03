import React, {useState} from "react";
import './styles.scss';

const getTextWidth = (text, font) => {
    // re-use canvas object for better performance
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

const CropIcons = ({crop, text, style, tick, tickX = 0, tickY = 25}) => {

    const getIcon = tick => {
        const tickRotation = 0;
        const tickConfig = {
            color: '#FFFFFF',
            fontColor: '#000000',
            fontSize: 10
        };
        const width = getTextWidth(tick.value, `${tickConfig.fontSize}px Roboto`) + 15;
        let icon = null;

        switch (crop) {
            case 'maize':
            case 'hybrid':
            case 'opv':
                icon = (<g>
                    <circle className="f7b802a5-8dc8-4ed5-b779-59a7608540e8" cx="20" cy="20" r="16"/>
                    <path className="b97b9221-9b87-47cc-927d-20f3dacb7b3d"
                          d="M13.08,27c1,1,1.92,3.56,4.61,2.18,5.06-2.61,8.12-4,10-5.47,3.23-2.61,1.91-6.92-1.35-10.14s-7.59-4.48-10.16-1.22c-1.49,1.9-2.79,5-5.33,10.06C9.49,25.11,12.1,26,13.08,27Z"/>
                    <path className="b97b9221-9b87-47cc-927d-20f3dacb7b3d" d="M17.79,17.08c1.25-4,4.35-2.22,5.82-.77"/>
                </g>)
                break;
            case 'rice':
                icon = (<g>
                    <circle className="a27dd23a-ae68-42c2-9254-e8f5885e4f12" cx="20" cy="20" r="16"/>
                    <path className="a7d6e25c-b002-4dfa-8cba-4bc3f632b392"
                          d="M14.47,27.22s-4.55-2.34-.86-8c5.23-8,13-8.26,13.7-7.82s2,8.24-4.8,15C17.71,31.19,14.47,27.22,14.47,27.22Z"/>
                    <line className="a7d6e25c-b002-4dfa-8cba-4bc3f632b392" x1="23.27" y1="16.64" x2="17.23" y2="23.67"/>
                </g>)
                break;
            case 'cowpea':
                icon = (<g>
                    <circle className="bf9b314a-3cc5-4de7-9c56-1dcdbbfe5361" cx="20" cy="20" r="16"/>
                    <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="20" cy="20" rx="11.27" ry="5.24"
                             transform="translate(-8.21 22.11) rotate(-49.28)"/>
                    <ellipse className="e636d849-c039-47ee-8a84-0bf4236dd588" cx="21.05" cy="18.78" rx="2.57" ry="1.58"
                             transform="translate(-6.92 22.48) rotate(-49.28)"/>
                </g>)
                break;
            case 'sorghum':
                icon = (<g>
                    <circle className="abc88409-45d9-469b-bf75-443eefae2382" cx="20" cy="20" r="16"/>
                    <path className="afe9d9e9-00d5-42ad-8c46-a31353170dce"
                          d="M25.63,24.93c-5.33,4.79-11.74,3.37-12.47,2.68S11,19.78,15.23,15.09C18.48,11.49,24.14,11,27,13.78S29.25,21.69,25.63,24.93Z"/>
                    <line className="afe9d9e9-00d5-42ad-8c46-a31353170dce" x1="25.58" y1="15.49" x2="23.43" y2="17.39"/>
                </g>)
                break;
            case 'bean':
            case 'beans':
                icon = (<g>
                    <circle className="aa6e84dc-188d-4dde-833c-e10c5fccc1f5" cx="20" cy="20" r="16"/>
                    <path className="f4c79124-c3c7-4425-bf35-508e84f2594a"
                          d="M13.05,20.64a16.75,16.75,0,0,0,5-2.91,16.84,16.84,0,0,0,3.57-4.57c1.55-2.34,4.28-2.24,6-.23,3.74,4.28-.58,9.47-3.38,11.93s-8.54,6-12.28,1.73C10.25,24.58,10.52,21.86,13.05,20.64Z"/>
                    <path className="f4c79124-c3c7-4425-bf35-508e84f2594a"
                          d="M20.21,24.22a8,8,0,0,1-3.75,1.28,2.36,2.36,0,0,1-1.93-.88"/>
                    <path className="f4c79124-c3c7-4425-bf35-508e84f2594a"
                          d="M16.6,18.89c-.05.12.7,3.69,3.19,1.82a1.8,1.8,0,0,0-1.49-3.23"/>
                </g>)
                break;
            case 'soya-bean':
                icon = (<g>
                    <circle className="accfa199-00cc-4240-808e-88dd557906bd" cx="20" cy="20" r="16"/>
                    <ellipse className="a7e51ff4-de5d-4544-85d3-ff2eda5a64f4" cx="20" cy="20" rx="8.79" ry="7.18"
                             transform="translate(-8.28 20) rotate(-45)"/>
                    <line className="a7e51ff4-de5d-4544-85d3-ff2eda5a64f4" x1="23.71" y1="16.53" x2="20.19" y2="19.84"/>
                </g>)
                break;
            case 'teff':
                icon = (<g>
                    <circle className="efca7a36-c950-4e49-acbf-eb02385e34cd" cx="20" cy="20" r="16"/>
                    <path className="f8b63ccf-56cc-47f5-8ead-ea35b7ba82a3"
                          d="M14.44,28.59a6.68,6.68,0,0,1,0-8.07c3.11-4.25,8.62-10.75,11.28-9.08s.61,9-4.24,14.69C18.25,30,14.44,28.59,14.44,28.59Z"/>
                </g>)
                break;
            case 'wheat':
                icon = (<g>
                    <circle className="b367725e-860d-43f5-bc07-af90c6178a91" cx="20" cy="20" r="16"/>
                    <path className="e49649ce-e292-418f-abc8-bfa373a82b7d"
                          d="M25.55,21.54a30.21,30.21,0,0,1-7.89,7.24,3.88,3.88,0,0,1-5.9-1.29c-2.43-3.95,4.58-11.65,5.92-13.12S23.1,8,27.23,11.23C29.65,13.1,28.33,17.94,25.55,21.54Z"/>
                    <path className="e49649ce-e292-418f-abc8-bfa373a82b7d" d="M14.6,26.35c2-4.46,9.77-13.78,12-15.18"/>
                </g>)
                break;
            case 'groundnut':
                icon = (<g>
                    <circle className="a0221b4d-0622-44c3-9060-374f3f5b534e" cx="20" cy="20" r="16"/>
                    <path className="b3539294-6edd-47c3-a951-3c4d906ca518"
                          d="M24.28,21.21a6.56,6.56,0,0,0,2.15-2.14,5.78,5.78,0,0,0,.45-5.84c-.66-1.15.11-2-.86-2.6s-1.39.46-2.72.36a5.77,5.77,0,0,0-5.05,3,6.66,6.66,0,0,0-1,2.87,3.46,3.46,0,0,1-1.63,2.55,6.58,6.58,0,0,0-2.09,2.11c-1.69,2.7-1.23,6,1,7.45s5.46.37,7.15-2.33a6.64,6.64,0,0,0,1-2.8A3.48,3.48,0,0,1,24.28,21.21Z"/>
                    <path className="b3539294-6edd-47c3-a951-3c4d906ca518" d="M24.47,17.92c-1,1.63-2.88,2.39-4,1.66"/>
                    <path className="b3539294-6edd-47c3-a951-3c4d906ca518" d="M19.82,25.35c-1,1.63-2.87,2.39-4,1.65"/>
                </g>)
                break;
            case 'sunflower':
                icon = (<g>
                    <circle className="e5c957f3-9b38-46ce-98fd-8bb68722b0d8" cx="20" cy="20" r="16"/>
                    <path className="fe279966-1178-46e2-b480-5f78cc4a8904"
                          d="M26,13.32c-1.29,9.46-5.33,15.32-10.09,13.91"/>
                    <path className="fe279966-1178-46e2-b480-5f78cc4a8904"
                          d="M22.94,14.18c-4.58,3-7.73,8.58-6.63,10.24"/>
                    <path className="fe279966-1178-46e2-b480-5f78cc4a8904"
                          d="M13.64,29.07c2.51,1.65,7.12,3.52,10.93-1.9,4.11-5.64,4.68-14.67,3.51-16.3s-8.11-.6-13.84,6.32C9.4,23,10.63,26.48,13.64,29.07Z"/>
                </g>)
                break;
            case 'millet':
                icon = (<g>
                    <circle className="f480e5fc-a519-4810-9648-414bd299b193" cx="20" cy="20" r="16"/>
                    <path className="bedfe655-5df4-4688-b8e3-ce3d3b284087"
                          d="M18.2,16.6c1.08-3.16,5.08-3.69,6.55-2.23"/>
                    <path className="bedfe655-5df4-4688-b8e3-ce3d3b284087"
                          d="M13.74,21.45c.12.92-.11,2.09-2,3.72a1,1,0,0,0-.17,1.26,7.15,7.15,0,0,0,4.12,3,.92.92,0,0,0,1-.51,4.42,4.42,0,0,1,3.71-2.64,9.49,9.49,0,0,0,5.7-3.87c2.72-3.75,2.58-8.49-.3-10.57s-7.42-.74-10.14,3A9.53,9.53,0,0,0,13.74,21.45Z"/>
                </g>)
                break;
        }

        return (<g transform={`translate(${tick.x - tickX},${tick.y + tickY})`}>
            {icon ? <g transform={`translate(-40, -20)`}>{icon}</g> : null}
            <text transform={`translate(${10 - (!icon ? 15 : 0)}, 2) rotate(${tickRotation})`}
                  textAnchor="left"
                  dominantBaseline="middle"
                  style={style}>
                {text}
            </text>
        </g>)
    }

    return getIcon(tick);
}
export default CropIcons
