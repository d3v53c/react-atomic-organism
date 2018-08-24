import React, {PureComponent} from 'react'
import {Line as LineGraph, Area, Group} from 'organism-react-graph'

import CancelButton from '../organisms/CancelButton'

class Line extends PureComponent
{
    state={
        isHover: false,
    }

    handleMouseEnter = e =>
    {
        this.setState({
            isHover: true
        })
    }

    handleMouseLeave = e =>
    {
        this.setState({
            isHover: false
        })
    }

    handleClickCancelBtn = e =>
    {
        console.log('click')
    }

    render()
    {
        const {start, end, from, to, ...props} = this.props
        const {isHover} = this.state
        const areaSize = 1
        let area = null
        let cancelButton = null
        let areaStyle = Styles.area
        let cancelStyle = Styles.cancel
        if (from && to) {
            if (isHover) {
                areaStyle = {...areaStyle, ...Styles.hover}
                cancelStyle = null
            }
            cancelButton = (
                <CancelButton 
                    x={start.x}
                    y={start.y}
                    onClick={this.handleClickCancelBtn}
                    style={cancelStyle}
                />
            )
            area = (
                <Area
                    data={[{x: start.x+15, y: start.y}, {x: end.x-15, y: end.y}]}
                    xLocator={d=>d.x}
                    y0Locator={d=>d.y+areaSize}
                    y1Locator={d=>d.y-areaSize}
                    style={areaStyle}
                />
            )
        }
        return (
            <Group>
                <LineGraph
                    {...props}
                    start={start}
                    end={end}
                    curve={true}
                    style={Styles.line}
                />
                <Group
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    {area}
                    {cancelButton}
                </Group>
            </Group>
        )
    }
}

export default Line

const Styles = {
    line: {
        stroke: '#333',
        strokeWidth: 1.5
    },
    area: {
        strokeLinejoin: 'round',
        stroke: '#000',
        strokeWidth: 15,
        strokeOpacity: 0, 
        fill: 'none'
    },
    hover: {
        strokeOpacity: '.1',
    },
    cancel: {
        opacity: 0 
    }
}
