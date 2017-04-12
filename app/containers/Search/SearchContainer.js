import React, { PropTypes } from 'react'
import { connect } from "react-redux";
import { Search } from 'components'

const SearchContainer = React.createClass({
    contextTypes: {
        router: PropTypes.object.isRequired,
    },
    handleSearch (e) {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        this.context.router.push('/searchResults/' + elements[0].value)
    },
    render () {
        return (
            <Search onSearch={this.handleSearch} />
        )
    }
});

export default connect()(SearchContainer)