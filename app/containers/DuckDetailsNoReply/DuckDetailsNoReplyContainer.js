import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { DuckDetailsNoReply } from 'components'
import { bindActionCreators } from 'redux'
import * as duckActionCreators from 'redux/modules/ducks'
import * as likeCountActionCreators from 'redux/modules/likeCount'
import * as repliesActionCreators from 'redux/modules/replies'
import { retrievingCurrentUserFromLocalStorage } from 'helpers/cognito'

const DuckDetailsContainer = React.createClass({
    propTypes: {
        duckId: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        duckAlreadyFetched: PropTypes.bool.isRequired,
        removeFetching: PropTypes.func.isRequired,
        fetchAndHandleDuck: PropTypes.func.isRequired,
        initLikeFetch: PropTypes.func.isRequired,
    },
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    componentDidMount () {
        this.props.initLikeFetch(this.props.duckId);
        if (this.props.duckAlreadyFetched === false) {
            this.props.fetchAndHandleDuck(this.props.duckId)
        } else {
            this.props.removeFetching()
        }
    },
    handleClick (e) {
        e.stopPropagation();
        this.context.router.push('/duckDetailReply/' + this.props.duckId)
    },
    render () {
        return (
            <DuckDetailsNoReply
                duckId={this.props.duckId}
                isFetching={this.props.isFetching}
                error={this.props.error}
                onClick={this.handleClick} />
        )
    },
});

function mapStateToProps({ducks, likeCount, users}, props) {
    return {
        isFetching: ducks.get('isFetching') || likeCount.isFetching,
        error: ducks.get('error'),
        authedUser: users.authedId === '' ? {} : users[users.authedId].info,
        duckId: props.routeParams.duckId,
        duckAlreadyFetched: !!ducks.get(props.routeParams.duckId)
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...duckActionCreators,
        ...likeCountActionCreators,
        ...repliesActionCreators,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DuckDetailsContainer)