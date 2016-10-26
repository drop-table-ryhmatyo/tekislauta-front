import React, {Component} from 'react';
import {Link} from 'react-router';
import Utilities from './Utilities';
import './styles/Post.css';

class Post extends Component {
    getIdColor() {
        const ip = this.props.data.ip;
        let r = parseInt(ip.substr(0, 2), 16);
        let g = parseInt(ip.substr(2, 2), 16);
        let b = parseInt(ip.substr(4, 2), 16);
        const modifier = parseInt(ip.substr(6, 2), 16);
        // the ip has 4 bytes, we only need 3. We could use the last one for alpha but that's trash
        // instead, we'll just xor
        r ^= modifier;
        g ^= modifier;
        b ^= modifier;
        let hsl = Utilities.RgbToHsl(r, g, b);
        hsl['s'] -= 20; // desaturate a little for that web 3.0 look
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }

    render() {
        console.log('Post props', this.props);
        
        let idStyle = {
            backgroundColor: this.getIdColor()
        }
        return (
            <div className='Post'>
                <div className='Post__header'>
                    <h3 className='Post__header__title'>
                        <Link className='Post__header__title__anchor' to={'/boards/' + this.props.board + '/' + this.props.data.id}>
                        {this.props.data.subject}
                        </Link>
                    </h3>
                    <time className='Post__header__timestamp'>{new Date(this.props.data.post_time*1000).toString()}</time>
                    <br/>
                    <p>By <span className='Post__header__id' style={idStyle}>{this.props.data.ip}</span></p>
                    <br/>
                </div>
                <div className='Post__content'>
                    <p>{this.props.data.message}</p>
                </div>
            </div>
        );
    }
}

export default Post;