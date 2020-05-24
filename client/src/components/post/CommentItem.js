import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/post';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const CommentItem = ({
	user: { _id },
	comment: { _id: commentId, name, avatar, user, text, date },
	postId,
	deleteComment
}) => {
	return (
		<div className="post bg-white p-1 my-1">
			<div>
				<Link to={`/profile/${user}`}>
					<img className="round-img" src={avatar} alt={name} />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p className="my-1">{text}</p>
				<p className="post-date">
					<Moment type="YYYY/MM/DD">{date}</Moment>
				</p>
				{_id === user && (
					<button
						type="button"
						className="btn btn-danger"
						onClick={(e) => deleteComment(commentId, postId)}
					>
						<i className="fas fa-times" />
					</button>
				)}
			</div>
		</div>
	);
};

CommentItem.propTypes = {
	comment: PropTypes.object.isRequired,
	postId: PropTypes.string.isRequired,
	deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	user: state.auth.user
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
