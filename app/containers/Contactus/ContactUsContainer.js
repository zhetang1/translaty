import React from 'react'
import { connect } from "react-redux";
import { ContactUs } from 'components'

const ContactUsContainer = React.createClass({
    render () {
        return (
            <ContactUs />
        )
    }
});

export default connect()(ContactUsContainer)