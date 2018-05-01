import React, {PureComponent} from 'react'; 
import PropTypes from 'prop-types';

import {SemanticUI} from 'react-atomic-molecule';

const keys = Object.keys;

/**
 * YouTube Embedded Players
 *
 * https://developers.google.com/youtube/player_parameters
 */
class YoutubeRWD extends PureComponent
{
    static propTypes = {
        videoId: PropTypes.string.isRequired
    };

    static defaultProps = {
        videoParams: {
            autoplay: 1,
            loop: 1,
            showinfo: 0,
            controls: 0,
            rel: 0,
            mute: 1,
            modestbranding: 1 
        },
        showControllBar: false,
        mask: true 
    };

    state = {
        load: 0
    };

    componentDidMount()
    {
        this.setState({
            load:1
        });
    }

    render()
    {
       const {load} = this.state;
       if (!load) {
           return null;
       } 
       const {videoId, videoParams, showControllBar, mask} = this.props;
       const aParams = [];
       keys(videoParams).forEach(
        key =>
        aParams.push(
            key+
            '='+
            encodeURIComponent(videoParams[key])
       ));
       if (videoParams['loop']) {
        aParams.push('playlist='+videoId);
       }
       const src = 'https://www.youtube.com/embed/'+
            videoId+
            '?'+
            aParams.join('&');

       const showControllBarStyle = {};
       if (showControllBar) {
            showControllBarStyle['marginBottom'] = -120;
       }

       let thisMask = null;
       if (mask) {
            thisMask = <SemanticUI style={Styles.mask} />; 
       }
       
       return (
        <SemanticUI className="youtube-player" style={Styles.container}>
            <SemanticUI className="youtube-player-inner" style={{...Styles.inner, ...showControllBarStyle}}>
                <iframe
                    style={Styles.iframe}
                    width="560"
                    height="315"
                    allow="autoplay"
                    allow="encrypted-media"
                    src={src}
                    onClick={e => {e.preventDefault(); console.log(e);}}
                />
            </SemanticUI>
            {thisMask} 
        </SemanticUI>
       );
    }
}

export default YoutubeRWD;

const Styles = {
    container: {
        overflow: 'hidden',
        position: 'relative',
        zIndex: 0
    },
    inner: {
        position: 'relative',
        padding: '0 0 100%',
        height: 0,
        overflow: 'hidden',
        marginBottom: -160,
        zIndex: 0,
    },
    iframe: {
        position: 'absolute', 
        top: 0,
        left: 0, 
        width: '100%',
        height: '100%',
        margin: '-120px 0',
    },
    mask: {
        zIndex: 1,
        position: 'absolute', 
        top: 0,
        left: 0, 
        right: 0,
        bottom: 0
    }
};
