import React from 'react';
import StaticComponent from '../static';

// Basically just an icon,
// create as plain class without this binding and never updates
export default class InteractiveIcon extends StaticComponent {

    render() {
        return (
            <svg
                className="icon interactive"
                viewBox="0 0 53.23 53.21"
                version="1.1" xmlns="http://www.w3.org/2000/svg"
            >
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">

                        <path style={{ fill: '#222e65' }} d="M48.86,0H11.37A4.34,4.34,0,0,0,7,4.35V41.6A4.34,4.34,0,0,0,11.37,46H48.86a4.34,4.34,0,0,0,4.35-4.35V4.35A4.19,4.19,0,0,0,48.86,0Zm1,40.88a1.65,1.65,0,0,1-1.69,1.69H11.85a1.65,1.65,0,0,1-1.69-1.69V5.32a1.65,1.65,0,0,1,1.69-1.69H48.14a1.65,1.65,0,0,1,1.69,1.69Z"/>

                        <path style={{ fill: 'none' }} d="M48.14,3.63H11.85a1.65,1.65,0,0,0-1.69,1.69V40.88a1.65,1.65,0,0,0,1.69,1.69H48.14a1.65,1.65,0,0,0,1.69-1.69V5.32A1.65,1.65,0,0,0,48.14,3.63ZM23.46,35.32V10.88L41.12,23.22Z"/>

                        <path style={{ fill: '#222e65' }} d="M3.39,47.65V18.78a1.61,1.61,0,0,0-1.61-1.61H1.61A1.61,1.61,0,0,0,0,18.78V48.86a4.35,4.35,0,0,0,4.35,4.35H33.47a1.61,1.61,0,0,0,1.61-1.61v-.41a1.61,1.61,0,0,0-1.61-1.61H5.32A1.94,1.94,0,0,1,3.39,47.65Z"/>

                        <path style={{ fill: '#15c0dc' }} d="M26,33.59,39.2,24.53a1.61,1.61,0,0,0,0-2.64L26,12.65A1.61,1.61,0,0,0,23.46,14v18.3A1.61,1.61,0,0,0,26,33.59Z"/>
                    </g>
                </g>
            </svg>
        );
    }
}
