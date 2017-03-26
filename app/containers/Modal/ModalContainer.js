import { bindActionCreators } from 'redux'
import { Modal } from 'components'
import { connect } from 'react-redux'
import * as modalActionCreators from 'redux/modules/modal'
import * as questionsActionCreators from 'redux/modules/questions'

function mapStateToProps({modal, users}) {
    const questionTextLength = modal.questionText.length;
    return {
        user: users[users.authedId] ? users[users.authedId].info : {},
        questionText: modal.questionText,
        isOpen: modal.isOpen,
        isSubmitDisabled: questionTextLength <= 0 || questionTextLength > 140,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({...modalActionCreators, ...questionsActionCreators}, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Modal)