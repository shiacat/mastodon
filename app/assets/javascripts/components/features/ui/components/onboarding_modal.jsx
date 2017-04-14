import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Permalink from '../../../components/permalink';
import { TransitionMotion, spring } from 'react-motion';

const PageOne = ({ acct, domain }) => (
  <div className='onboarding-modal__page onboarding-modal__page-one'>
    <div style={{ flex: '0 0 auto' }}>
      <div className='onboarding-modal__page-one__elephant-friend' />
    </div>

    <div>
      <h1><FormattedMessage id='onboarding.page_one.welcome' defaultMessage='Welcome to Mastodon!' /></h1>
      <p><FormattedMessage id='onboarding.page_one.federation' defaultMessage='Mastodon is a decentralized federation of different server instances linking up and forming one larger social network.' /></p>
      <p><FormattedMessage id='onboarding.page_one.handle' defaultMessage='You are on {domain}, so your full handle is {handle}' values={{ domain, handle: <strong>{acct}@{domain}</strong> }}/></p>
    </div>
  </div>
);

const PageTwo = () => (
  <div className='onboarding-modal__page onboarding-modal__page-two'>
    <img className="onboarding-modal__image onboard-compose" src='/onboarding/onboard-compose.jpg' />
    <p><FormattedMessage id='onboarding.page_two.compose' defaultMessage='Write posts from the compose column. You can upload images, change privacy settings, and add content warnings with the icons below.' /></p>
  </div>
);

const PageThree = () => (
  <div className='onboarding-modal__page onboarding-modal__page-three'>
    <img className="onboarding-modal__image onboard-compose" src='/onboarding/onboard-search.jpg' />
    <p><FormattedMessage id='onboarding.page_three.search' defaultMessage='Use the search bar to find people and look at hashtags, such as {illustration} and {introductions}. To look for a person who is not on this instance, use their full handle.' values={{ illustration: <Permalink to='/timelines/tag/illustration' href='/tags/illustration'>#illustration</Permalink>, introductions: <Permalink to='/timelines/tag/introductions' href='/tags/introductions'>#introductions</Permalink> }}/></p>
    <p><FormattedMessage id='onboarding.page_three.profile' defaultMessage='Click "Edit Profile" to change your avatar, bio, and display name. There, you will also find other preferences.' /></p>
  </div>
);

const PageFour = () => (
  <div className='onboarding-modal__page onboarding-modal__page-four'>
    <div className='figure'>
      <img className="onboarding-modal__image onboard-column" src='/onboarding/onboard-home.jpg' />
      <FormattedMessage id='onboarding.page_four.home' defaultMessage='Home timeline shows posts from yourself, people you follow, and the posts they share'/>
    </div>

    <div className='figure'>
      <img className="onboarding-modal__image onboard-column" src="/onboarding/onboard-notifications.jpg" />
      <FormattedMessage id='onboarding.page_four.notifications' defaultMessage='The notifications column shows when a user shares, favourites, or replies to your posts, and when you have a new follower' />
    </div>

    <p><FormattedMessage id='onboarding.page_four.filter' defaultMessage='Each column can be customized using the {icon} menu.' values={{ icon: <i className='fa fa-sliders' /> }} /></p>
  </div>
);

const PageFive = ({ domain }) => (
  <div className='onboarding-modal__page onboarding-modal__page-five'>
    <div className='figure'>
      <img className="onboarding-modal__image onboard-column" src="/onboarding/onboard-local-timeline.jpg" />
      <FormattedMessage id='onboarding.page_five.local-timeline' defaultMessage='Local timeline lists public posts originating from people on {domain}, your local instance' values={{ domain }} />
    </div>

    <div className='figure'>
      <img className="onboarding-modal__image onboard-column" src="/onboarding/onboard-federated-timeline.jpg" />
      <FormattedMessage id='onboarding.page_five.federated-timeline' defaultMessage='Federated timeline lists public posts from everyone who people on {domain} follow, regardless of which instance they are from' values={{ domain }} />
    </div>

    <p><FormattedMessage id='onboarding.page_five.public' defaultMessage='These are the public timelines, a great way to discover content.' /></p>
  </div>
);

const PageSix = ({ admin }) => {
  let adminSection = '';

  if (admin) {
    adminSection = (
      <p>
        <FormattedMessage id='onboarding.page_six.admin' defaultMessage="Your instance's admin is {admin}." values={{ admin: <Permalink href={admin.get('url')} to={`/accounts/${admin.get('id')}`}>@{admin.get('acct')}</Permalink> }} />
        <br />
        <FormattedMessage id='onboarding.page_six.read_guidelines' defaultMessage='Please, do not forget to read the {guidelines}!' values={{ guidelines: <a href='/about/more' target='_blank'><FormattedMessage id='onboarding.page_six.guidelines' defaultMessage='community guidelines' /></a> }}/>
      </p>
    );
  }

  return (
    <div className='onboarding-modal__page onboarding-modal__page-six'>
      <h1><FormattedMessage id='onboarding.page_six.almost_done' defaultMessage='Almost done...' /></h1>
      {adminSection}
      <p><FormattedMessage id='onboarding.page_six.github' defaultMessage='Mastodon is free open-source software. You can report bugs, request features, or contribute to the code on {github}.' values={{ github: <a href='https://github.com/tootsuite/mastodon' target='_blank' rel='noopener'>GitHub</a> }} /></p>
      <p><FormattedMessage id='onboarding.page_six.apps_available' defaultMessage='There are {apps} available for iOS, Android and other platforms. And now... Bon Appetoot!' values={{ apps: <a href='https://github.com/tootsuite/documentation/blob/master/Using-Mastodon/Apps.md' target='_blank' rel='noopener'><FormattedMessage id='onboarding.page_six.various_app' defaultMessage='various mobile apps' /></a> }} /></p>
    </div>
  );
};

const mapStateToProps = state => ({
  me: state.getIn(['accounts', state.getIn(['meta', 'me'])]),
  admin: state.getIn(['accounts', state.getIn(['meta', 'admin'])]),
  domain: state.getIn(['meta', 'domain'])
});

const OnboardingModal = React.createClass({

  propTypes: {
    onClose: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired,
    me: ImmutablePropTypes.map.isRequired,
    domain: React.PropTypes.string.isRequired,
    admin: ImmutablePropTypes.map
  },

  getInitialState () {
    return {
      currentIndex: 0
    };
  },

  mixins: [PureRenderMixin],

  handleSkip (e) {
    e.preventDefault();
    this.props.onClose();
  },

  handleDot (i, e) {
    e.preventDefault();
    this.setState({ currentIndex: i });
  },

  handleNext (maxNum, e) {
    e.preventDefault();

    if (this.state.currentIndex < maxNum - 1) {
      this.setState({ currentIndex: this.state.currentIndex + 1 });
    } else {
      this.props.onClose();
    }
  },

  render () {
    const { me, admin, domain } = this.props;

    const pages = [
      <PageOne acct={me.get('acct')} domain={domain} />,
      <PageTwo />,
      <PageThree />,
      <PageFour />,
      <PageFive domain={domain} />,
      <PageSix admin={admin} />
    ];

    const { currentIndex } = this.state;
    const hasMore = currentIndex < pages.length - 1;

    let nextOrDoneBtn;

    if(hasMore) {
      nextOrDoneBtn = <a href='#' onClick={this.handleNext.bind(null, pages.length)} className='onboarding-modal__nav onboarding-modal__next'><FormattedMessage id='onboarding.next' defaultMessage='Next' /></a>;
    } else {
      nextOrDoneBtn = <a href='#' onClick={this.handleNext.bind(null, pages.length)} className='onboarding-modal__nav onboarding-modal__done'><FormattedMessage id='onboarding.next' defaultMessage='Done' /></a>;
    }

    const styles = pages.map((page, i) => ({
      key: i,
      style: { opacity: spring(i === currentIndex ? 1 : 0) }
    }));

    return (
      <div className='modal-root__modal onboarding-modal'>
        <TransitionMotion styles={styles}>
          {interpolatedStyles =>
            <div className='onboarding-modal__pager'>
              {pages.map((page, i) =>
                <div key={i} style={{ opacity: interpolatedStyles[i].style.opacity, pointerEvents: i === currentIndex ? 'auto' : 'none' }}>{page}</div>
              )}
            </div>
          }
        </TransitionMotion>

        <div className='onboarding-modal__paginator'>
          <div>
            <a href='#' className='onboarding-modal__skip' onClick={this.handleSkip}><FormattedMessage id='onboarding.skip' defaultMessage='Skip' /></a>
          </div>

          <div className='onboarding-modal__dots'>
            {pages.map((_, i) => <div key={i} onClick={this.handleDot.bind(null, i)} className={`onboarding-modal__dot ${i === currentIndex ? 'active' : ''}`} />)}
          </div>

          <div>
            {nextOrDoneBtn}
          </div>
        </div>
      </div>
    );
  }

});

export default connect(mapStateToProps)(injectIntl(OnboardingModal));
