import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import BoardThreadList from './BoardThreadList';
import SubmitForm from './SubmitForm';
import Endpoints from './Endpoints';
import './styles/BoardView.css';

class BoardView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            threads: [],
            totalThreadsOnServer: 0,
            offset: this.offsetFromPage(props.params.page)
        };
    }

    offsetFromPage(page) {
        return page * 10;
    }

    componentDidMount() {
        this.fetchThreads(this.props.params.board, this.state.offset);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchThreads(nextProps.params.board, this.offsetFromPage(nextProps.params.page));
    }

    componentDidUpdate(prevProps, prevState) {
        const currPage = parseInt(this.props.params.page, 10);
        const thereAreNoThreadsAndWeAreOnOnlyPage = this.state.pageNum <= 0 && currPage === 0;
        if (currPage >= this.state.pageNum && !thereAreNoThreadsAndWeAreOnOnlyPage) {
            // don't let people go over the limit
            this.navigateToPage(0);
        }
    }

    getAmountOfPostsElem() {
        const amountOfPostsElem = 
            this.state.totalThreadsOnServer > 0
                ? (<p>Threads: {this.state.totalThreadsOnServer}</p>)
                : (<p>No threads yet! Submit a new thread with the form above.</p>);
        return (
            <div className="BoardView__totalPostsCounter">
                {amountOfPostsElem}
            </div>
        );
    }

    render() {
        let content = <BoardThreadList threads={this.state.threads} board={this.props.params.board} />;
        if (this.state.threads.length < 1) {
            // no threads here yet
            content = "";
        }
        return (
            <div className="BoardView">
                <SubmitForm title="Submit new thread" submit={this.submitResponse.bind(this)} />
                {this.getAmountOfPostsElem()}
                <ReactPaginate previousLabel={"<previous"}
                               nextLabel={"next>"}
                               pageNum={this.state.pageNum}
                               initialSelected={parseInt(this.props.params.page, 10)}
                               pageRangeDisplayed={5}
                               marginPagesDisplayed={2}
                               clickCallback={this.handlePageClick.bind(this)}
                               breakLabel={<a href="">...</a>}
                               containerClassName={"Pagination"}
                               subContainerClassName={"Pagination__pages Pagination"}
                               activeClassName={"Pagination__active"} 
                />
                {content}
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

    fetchThreads(board, offset) {
        Endpoints.Threads(board).getData('?start=' + offset)
        .then(data => {
            data.board = board; // silly reply links need this
            this.setState({
                threads: data.posts,
                pageNum: Math.ceil(data.total_count / 10),
                totalThreadsOnServer: data.total_count
            });
        })
        .catch(err => {
            console.error(this.constructor.name, 'Error while fetching threads!', err);
        });
    }

    handlePageClick(data) {
        const selectedIndex = data.selected;
        const offset = Math.ceil(selectedIndex * 10);

        this.navigateToPage(selectedIndex);
        this.setState({
            offset: offset
        });
    }

    navigateToPage(page) {
        const currentPath = this.props.router.location.pathname;
        const lastSlash = currentPath.lastIndexOf('/');
        const newPath = currentPath.substring(0, lastSlash + 1) + page;
        this.props.router.push(newPath);
    }
}

export default BoardView;