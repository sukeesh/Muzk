import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Checkbox, Input } from 'antd';

class FetchDemo extends React.Component {
  static propTypes = {
    subreddit: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      mid: 'Eminem',
      posts: [],
      loading: true,
      error: null
    }
  }

  componentDidMount() {
    axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.search&track=${this.state.mid}&api_key=f90ffa331e3a3c46746aa5c2efeb5540&format=json`)
      .then(res => {
        const posts = res.data;
        this.setState({
          posts,
          loading: false,
          error: null
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: err
        });
      });
  }

  renderLoading() {
    return <div>Loading ...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }

  renderPosts() {
    const { error, posts } = this.state;

    this.renderLoading();

    if(error) {
      return this.renderError();
    }

    var idx = [];
    var len = posts.results["opensearch:itemsPerPage"];

    for ( var i = 0 ; i < len ; i ++ ){
      idx.push(i);
    }

    var compo_idx = idx.map(function (i) {
      return (
        <li>
          <a href={posts.results.trackmatches.track[i].url}>
            <Checkbox> </Checkbox>
            <img src={posts.results.trackmatches.track[i].image[0]["#text"]} />
            {posts.results.trackmatches.track[i].name}
          </a>
        </li>
      );
    });

    return(
      <ul type="disc">
        {compo_idx}
      </ul>
    );
  }

  handleChange = (e) => {
    this.setState({
      mid: e.target.value,
    });
    this.componentDidMount();
  }

  render() {
    const { loading } = this.state;
    return (
      <div>
        <h1>Muzk</h1>
          <div id = "input_area">
            <h4>You are searching for {this.state.mid}</h4>
            <Input placeholder="Eminem"  onChange = {this.handleChange} type = "text" /><br/><br/>
              {loading ? this.renderLoading() : this.renderPosts()}
          </div>
      </div>
    );
  }
}

export default FetchDemo;
