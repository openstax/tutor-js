import { React, styled, observer } from 'vendor'
import { Icon } from 'shared'
import UiSettings from 'shared/model/ui-settings'
import { currentOfferings, Course } from '../../models'

const NotificationBar = styled.div`
  background: #232E66;
  font-size: 2rem;

  a {
      &, &:hover { color: #fff; }
      text-decoration: underline;
      font-weight: bold;
  }

  .dismiss.ox-icon {
      font-size: 2.33rem;
      margin-top: 5px;
  }
`;

const Sociology3eBanner = observer(({ course }: { course: Course }) => {
    const setting = 'soc3eBannerDismissed'
    const announceable = course.offering?.isSociology2e && currentOfferings.soc3eExists && !currentOfferings.soc3eAvailable

    if (!announceable || UiSettings.get(setting) === true) {
        return null
    }

    const dismiss = () => {
        UiSettings.set(setting, true)
        return null
    }

    return (
        <NotificationBar className="openstax-notifications-bar" data-test-id="sociology-3e-banner">
            <div className="notification">
                <div className="content">
                    A new edition&nbsp;<i>Introduction to Sociology 3e</i>&nbsp;will be available soon.&nbsp;<a href="https://openstax.org/blog/what-makes-openstax-introduction-to-sociology-unique" target="_blank">Learn more</a>
                </div>
                <Icon type="close" className="dismiss" onClick={dismiss} />
            </div>
        </NotificationBar>
    )
})

export default Sociology3eBanner
