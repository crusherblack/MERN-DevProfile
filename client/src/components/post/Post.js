import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import Postitem from '../posts/PostItem';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = ({ posts: { loading, post }, getPost, match }) => {
	useEffect(
		() => {
			getPost(match.params.id);
		},
		[ getPost ]
	);

	return (
		<Fragment>
			{post === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to="/posts" className="btn">
						Back To Posts
					</Link>
					<Postitem post={post} showActions={false} />
					<CommentForm postId={post._id} />
					<div className="comments">
						{post.comments.map((comment) => (
							<CommentItem
								key={comment._id}
								comment={comment}
								postId={post._id}
							/>
						))}
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Post.propTypes = {
	posts: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	posts: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
