import React, { PropTypes } from 'react'
import { SearchResults } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as searchQuestionsActionCreators from 'redux/modules/searchQuestions'
import { staleUser, staleQuestions } from 'helpers/utils'
import { retrievingCurrentUserFromLocalStorage, retrievingCurrentUserNameFromLocalStorage,
    createDdbDocClient } from 'helpers/cognito'
import { formatUserInfo } from 'helpers/utils'

const SearchResultsContainer = React.createClass({
    propTypes: {
        phrase: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        questionIds: PropTypes.array.isRequired,
        fetchAndHandleSearchQuestions: PropTypes.func.isRequired,
        lastUpdatedQuestions: PropTypes.number.isRequired,
    },
    componentDidMount () {
        const phrase = this.props.routeParams.phrase;

        if (staleQuestions(this.props.lastUpdatedQuestions)) {
            this.props.fetchAndHandleSearchQuestions(phrase);
        }
    },
    render () {
        return (
            <SearchResults
            phrase={this.props.phrase}
            isFetching={this.props.isFetching}
            error={this.props.error}
            questionIds={this.props.questionIds} />
        )
    }
});

function mapStateToProps ({searchQuestions}, props) {
    return {
        phrase: props.routeParams.phrase,
        isFetching: searchQuestions.isFetching,
        error: searchQuestions.error,
        questionIds: [],
        lastUpdatedQuestions: 0,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        ...searchQuestionsActionCreators,
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchResultsContainer)