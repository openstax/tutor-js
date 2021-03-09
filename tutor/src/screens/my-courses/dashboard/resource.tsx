import React, { ReactElement } from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import { colors } from 'theme'
import { Icon } from 'shared'

const StyledResource = styled.div`
    &&& {
        .my-courses-item {
            .my-courses-item-title {
                padding: 0;
            }
            &.has-not-appearance {
                background-color:white;
                a .preview-belt {
                    background: black;
                    p {color: white; }
                }
            }
        }
        a {
            display: block;
            color: black;
            .name {
                padding: 1.2rem;
            }
            .preview-belt {
                background: white;
                box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
                bottom: 40%;
                h4 {
                    font-size: 1.8rem;
                    line-height: 2rem;
                    font-weight: 600;
                }
                p {
                    color: ${colors.neutral.thin};
                    margin-top: 0;
                }
            }
        }
        svg {
            margin: 0;
        }
        svg[data-icon="external-link-square-alt"] {
            position: absolute;
            bottom: 16px;
            left: 12px;
        }
    }
`

interface ResourcesProps {
    title: string | ReactElement
    info: string
    link: string
    appearanceCode?: string
    className?: string
}

const Resources: React.FC<ResourcesProps> = ({ title, info, link, appearanceCode, className }) => {
    const itemClasses = cn('my-courses-item', 'resource', className, { 'has-not-appearance': !appearanceCode })
    return (
        <StyledResource className="my-courses-item-wrapper">
            <div
                data-appearance={appearanceCode}
                data-test-id="course-card"
                data-is-teacher={true}
                className={itemClasses}
            >
                <a className="my-courses-item-title" href={link} target="_blank">
                    <h4 className="name">{title}</h4>
                    <div className="preview-belt">
                        <p>{info}</p>
                    </div>
                    <Icon type="external-link-square" />
                </a>
            </div>
        </StyledResource>
    )
}

export default Resources
