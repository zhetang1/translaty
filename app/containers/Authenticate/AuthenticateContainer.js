import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'

const AuthenticateContainer = React.createClass({
    propTypes: {
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        fetchAndHandleAuthedUser: PropTypes.func.isRequired,
        fetchAndHandleLoginUser: PropTypes.func.isRequired,
    },
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    handleAuth (e) {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        this.props.fetchAndHandleAuthedUser(elements[0].value, elements[1].value)
            .then(() => this.context.router.replace('feed'))
    },
    handleLogin (e) {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        this.props.fetchAndHandleLoginUser(elements[0].value, elements[1].value)
            .then(() => this.context.router.replace('feed'))
    },
    render () {
        return (
            <Authenticate
                isFetching={this.props.isFetching}
                error={this.props.error}
                onAuth={this.handleAuth}
                onLogin={this.handleLogin} />
        )
    }
});

function mapStateToProps ({users}) {
    return {
        isFetching: users.isFetching,
        error: users.error,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators(userActionCreators, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticateContainer)