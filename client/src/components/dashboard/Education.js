import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
	const educations = education.map((education) => (
		<tr key={education._id}>
			<td>{education.school}</td>
			<td className="hide-sm">{education.degree}</td>
			<td>
				<Moment format="YYYY/MM/DD">{education.from}</Moment> -{' '}
				{education.to === null ? (
					'Now'
				) : (
					<Moment format="YYYY/MM/DD">{education.to}</Moment>
				)}
			</td>
			<td>
				<button
					className="btn btn-danger"
					onClick={() => deleteEducation(education._id)}
				>
					Delete
				</button>
			</td>
		</tr>
	));

	return (
		<Fragment>
			<h2 className="my-2">Education Credentials</h2>
			<table className="table" width="100%">
				<thead>
					<tr>
						<th width="30%">School</th>
						<th className="hide-sm" width="30%">
							Degree
						</th>
						<th>Years</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>{educations}</tbody>
			</table>
		</Fragment>
	);
};

Education.propTypes = {
	education: PropTypes.array.isRequired,
	deleteEducation: PropTypes.func.isRequired
};

export default connect(null, { deleteEducation })(Education);
