import React, { useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

import Spinner from '../layout/Spinner';

const Dashboard = ({
	getCurrentProfile,
	auth: { user },
	profile: { profile, loading }
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, []);
	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className="large text-primary">Dashboard</h1>
			<p className="lead" style={{ textTransform: 'capitalize' }}>
				<i className="fas fa-user" /> Welcome {user && user.name}
			</p>
			{/* Cek jika user punya profile */}
			{profile !== null ? (
				<Fragment>has</Fragment>
			) : (
				<Fragment>
					<p>You Have not yet set up profile, please add some info</p>
					<Link to="/create-profile" className="btn btn-primary my-1">
						Create Profile
					</Link>
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
