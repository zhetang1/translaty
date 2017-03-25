import React, { PropTypes } from 'react'
import { default as ReactModal } from 'react-modal'
import {
    newDuckTop, pointer, newDuckInputContainer,
    newDuckInput, submitDuckBtn, darkBtn } from './styles.css'
import { formatDuck } from 'helpers/utils'

const modalStyles = {
    content: {
        width: 350,
        margin: '0px auto',
        height: 220,
        borderRadius: 5,
        background: '#EBEBEB',
        padding: 0,
    },
};

const { object, string, func, bool } = PropTypes;
Modal.propTypes = {
    duckText: string.isRequired,
    closeModal: func.isRequired,
    isOpen: bool.isRequired,
    isSubmitDisabled: bool.isRequired,
    openModal: func.isRequired,
    updateDuckText: func.isRequired,
    user: object.isRequired,
    questionFanout: func.isRequired,
};

export default function Modal (props) {
    function submitDuck () {
        props.questionFanout(formatDuck(props.duckText, props.user))
    }

    return (
        <span className={darkBtn} onClick={props.openModal}>
      {'Ask Question'}
            <ReactModal style={modalStyles}
                        isOpen={props.isOpen}
                        onRequestClose={props.closeModal}
                        contentLabel={'Duck'}>
        <div className={newDuckTop}>
          <span>{'Ask Question'}</span>
          <span onClick={props.closeModal} className={pointer}>{'X'}</span>
        </div>
        <div className={newDuckInputContainer}>
          <textarea
              onChange={(e) => props.updateDuckText(e.target.value)}
              value={props.duckText}
              maxLength={140}
              type='text'
              className={newDuckInput}
              placeholder="What's on your mind?" />
        </div>
        <button
            className={submitDuckBtn}
            disabled={props.isSubmitDisabled}
            onClick={submitDuck}>
            {'Post Your Question'}
        </button>
      </ReactModal>
    </span>
    )
}