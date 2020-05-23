import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
	const experiences = experience.map((experience) => (
		<tr key={experience._id}>
			<td>{experience.company}</td>
			<td className="hide-sm">{experience.title}</td>
			<td>
				<Moment format="YYYY/MM/DD">{experience.from}</Moment> -{' '}
				{experience.to === null ? (
					'Now'
				) : (
					<Moment format="YYYY/MM/DD">{experience.to}</Moment>
				)}
			</td>
			<td>
				<button
					className="btn btn-danger"
					onClick={() => deleteExperience(experience._id)}
				>
					Delete
				</button>
			</td>
		</tr>
	));

	return (
		<Fragment>
			<h2 className="my-2">Experience Credentials</h2>
			<table className="table" width="100%">
				<thead>
					<tr>
						<th width="30%">Company</th>
						<th className="hide-sm" width="30%">
							Title
						</th>
						<th>Years</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>{experiences}</tbody>
			</table>
		</Fragment>
	);
};

Experience.propTypes = {
	experience: PropTypes.array.isRequired,
	deleteExperience: PropTypes.func.isRequired
};

export default connect(null, { deleteExperience })(Experience);
