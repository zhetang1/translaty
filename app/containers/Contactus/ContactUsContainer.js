import React, { PropTypes } from 'react'
import { connect } from "react-redux";
import { ContactUs } from 'components'

const ContactUsContainer = React.createClass({
    propTypes: {
        dispatch: PropTypes.func.isRequired,
    },
    render () {
        return (
            <ContactUs />
        )
    }
});

export default connect()(ContactUsContainer)