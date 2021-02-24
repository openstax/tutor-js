import React from 'react';
import StaticComponent from '../static';

// Basically just an icon,
// create as plain class without this binding and never updates
export default class MultipartIcon extends StaticComponent {

    render() {
        return (
            <svg
                className="icon multipart"
                width="17.5px" height="17.5px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17.57 17.61"
            >
                <g id="Layer_2" data-name="Layer 2">
                    <g id="Layer_1-2" data-name="Layer 1">
                        <path
                            style={{ fill: '#222e65' }}
                            d="M9.43,17.61a8.88,8.88,0,0,0,8.14-7.67.46.46,0,0,0-.46-.52H9.88a.46.46,0,0,0-.46.46Z"
                        />
                        <path
                            style={{ fill: '#222e65' }}
                            d="M7.62,0A8.8,8.8,0,0,0,0,7.62a.46.46,0,0,0,.46.52H7.68a.46.46,0,0,0,.46-.46V.46A.46.46,0,0,0,7.62,0Z"
                        />
                        <path
                            style={{ fill: '#222e65' }}
                            d="M0,9.95a8.88,8.88,0,0,0,7.61,7.61.46.46,0,0,0,.52-.46V9.88a.46.46,0,0,0-.46-.46H.46A.46.46,0,0,0,0,9.95Z"
                        />
                        <path
                            style={{ fill: '#15c0dc' }}
                            d="M9.88,8.14H17.1a.46.46,0,0,0,.46-.52A8.8,8.8,0,0,0,9.95,0a.46.46,0,0,0-.52.46V7.68A.46.46,0,0,0,9.88,8.14Z"
                        />
                    </g>
                </g>
            </svg>
        );
    }
}
