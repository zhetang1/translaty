import React, { PropTypes } from 'react'
import { ConfirmRegistration } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActionCreators from 'redux/modules/users'

const ConfirmRegistrationContainer = React.createClass({
    propTypes: {
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        resendCode: PropTypes.func.isRequired,
        confirmUser: PropTypes.func.isRequired,
    },
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    handleResend (e) {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        this.props.resendCode(elements[0].value);
    },
    handleAuth (e) {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        this.props.confirmUser(elements[0].value, elements[1].value);
        this.context.router.replace('auth')
    },
    render () {
        return (
            <ConfirmRegistration
                isFetching={this.props.isFetching}
                error={this.props.error}
                onResend={this.handleResend}
                onAuth={this.handleAuth} />
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
)(ConfirmRegistrationContainer)