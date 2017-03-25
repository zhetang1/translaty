import React, {PropTypes} from 'react'
import { container, title, slogan } from './styles.css'

export default function Home (props) {
    return (
        <div className={container}>
            <p className={title}>{'Translaty'}</p>
            <p className={slogan}>{'The real time, cloud based, modular, scalable, growth hack, social platform.'}</p>
        </div>
    )
}