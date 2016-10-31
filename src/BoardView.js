import React, {Component} from 'react';
import ThreadList from './ThreadList';
import ThreadSubmitForm from './ThreadSubmitForm';
import Endpoints from './Endpoints';
import './styles/BoardView.css';

class BoardView extends Component {
    render() {
        return (
            <div className="BoardView">
                <ThreadSubmitForm submit={this.submitResponse.bind(this) } />
                <ThreadList abbreviation={this.props.params.board}/>
            </div>
        );
    }

    submitResponse(formData) {
        Endpoints.Threads(this.props.params.board).postData(formData)
        .then(data => {
            console.log("BoardView::submitResponse", data);
            window.location.reload();
        })
        .catch(err => {
            console.error("BoardView::submitResponse", "Error while submitting new topic", err);
        });
    }
}

export default BoardView;