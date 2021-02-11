import { React, cn, styled } from 'vendor'
import { colors } from 'theme'
import { Icon } from 'shared'

const StyledResource = styled.div`
  &&& {
    .my-courses-item {
      &.has-not-appearance {
        background-color:white;
        a .preview-belt {
          background: black;
          p {color: white; }
        }
      }
    }
    a {
      color: black;
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
        }
      }
    }
    svg[data-icon="external-link-square-alt"] {
      position: absolute;
      bottom: 20px;
      left: 15px;
    }
  }
`

interface ResourcesProps {
  title: string | React.Element
  info: string
  link: string
  appearanceCode?: string
  className?: string
}

const Resources = ({ title, info, link, appearanceCode, className } : ResourcesProps) => {
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
          <h3 className="name">{title}</h3>
          <div className="preview-belt">
              <p>{info}</p>
          </div>
      </a>
      <Icon type="external-link-square"/>
    </div>
  </StyledResource>
  )
}

export default Resources