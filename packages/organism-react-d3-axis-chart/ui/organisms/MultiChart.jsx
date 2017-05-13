import React, {Component, Children, cloneElement} from 'react'; 
import {
    SemanticUI
} from 'react-atomic-molecule';
import {mouse} from 'getoffset';
import get from 'get-object-value';

class MultiChart extends Component
{
    handleMouseEnter = (e)=>
    {
        this.setState({
            hideCrosshairY: false, 
        });
    }

    handleMouseLeave = (e)=>
    {
        //console.log('leave', e);
        this.setState({
            hideCrosshairY: true, 
        });
    }

    handleMouseMove = (e, point)=>
    {
        this.setState({
            hideCrosshairY: false, 
            crosshairX: point[0] 
        });
    }

    render()
    {
        const {
            children,
            scaleW,
            scaleH,
            extraViewBox,
            subChartScaleH,
            ...props
        } = this.props; 
        const {
            crosshairX,
            hideCrosshairY
        } = get(this, ['state'], {});
        let thisExtraViewBox = extraViewBox;
        let subChartCount = 0;
        Children.forEach(children, (child)=>{
            if ('sub' === child.props.multiChart) {
                subChartCount++;
            }
        });
        let mainChartScaleH = 
            scaleH -
            20 -
            ((subChartScaleH+20) * subChartCount);
        let high = 0;
        return (
            <SemanticUI
                {...props}
                viewBox={`0 0 ${Math.round(scaleW + thisExtraViewBox)} ${Math.round(scaleH + thisExtraViewBox)}`}
                style={{pointerEvents:'bounding-box'}}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            > 
            {Children.map(children, (child, k)=>{
                let params = {
                    k: k,
                    scaleW: scaleW,
                    crosshairX: crosshairX,
                    hideCrosshairY: hideCrosshairY,
                    handleMouseMove: this.handleMouseMove
                };
                if ('main' === child.props.multiChart) {
                    high += 20 + mainChartScaleH;
                    return cloneElement(
                        child,
                        {
                            ...params,
                            scaleH: mainChartScaleH,
                            transform: `translate(50, ${high - mainChartScaleH})`,
                        }
                    );
                } else {
                    high += 20 + subChartScaleH;
                    return cloneElement(
                        child,
                        {
                            ...params,
                            scaleH: subChartScaleH,
                            transform: `translate(50, ${high - subChartScaleH})`,
                        }
                    );
                }
            })}
            </SemanticUI>
        );
    }
}

MultiChart.defaultProps = {
    atom: 'svg',
    preserveAspectRatio: 'xMidYMid meet',
    scaleW: 450,
    scaleH: 450,
    extraViewBox: 100,
    subChartScaleH: 68
}

export default MultiChart;
