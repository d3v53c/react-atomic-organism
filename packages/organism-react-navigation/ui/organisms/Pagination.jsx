import React, {Component} from 'react'; 

import {
    min,
    reactStyle,
    Item,
    Menu
} from 'react-atomic-molecule';

const plusOne = (i) =>
{
    return i+1;
};

const getFromTo = (from, to) =>
{
    return plusOne(from)+ '-'+ plusOne(to);
}

const BasePage = (props)=>
{
    const {component, className,  children, style, url} = props;
    let build;
    if (React.isValidElement(component)) {
        build = React.cloneElement;
    } else {
        build = React.createElement;
    }
    return build(
        component,
        {
            title: getFromTo(props[0], props[1]),
            className: className,
            href: url,
            style: {
                ...{display:'none', minWidth: '2rem'},
                ...style
            }
        },
        children
    );
}

const Page = (props)=>(
    <BasePage {...props}>{props.currentPage}</BasePage>
);

const Forward = (props)=>(
    <BasePage style={{display:'inline'}} {...props}>{'> '+ props.txtMore}</BasePage>
);

const Backward = (props)=>(
    <BasePage style={{display:'inline'}} {...props}>{'<'}</BasePage>
);

const Current = (props)=>(
    <Item
        title={getFromTo(props[0], props[1])}
        className="active"
        style={{display: 'inline'}}
    >
    {props.currentPage}
    </Item>
);

const FirstPage = (props)=>(
    <Page {...props} />
);

const LastPage = (props)=>(
    <Page {...props} />
);

const Ellipsis = (props)=>(
    <Item
        className="disabled"
        style={{
            display:'none',
            minWidth: '1rem'
        }}
    >
    ...
    </Item>
);

const Pagination = (props)=>
{
    const pg = props; 
    const {linkComponent, txtMore} = pg;
    let firstPage;
    let firstEllipsis;
    let lastPage;
    let lastEllipsis;
    if (pg.firstPage) {
        firstPage = <FirstPage {...pg.firstPage} component={linkComponent}/>;
        firstEllipsis =  <Ellipsis />;
    }
    if (pg.lastPage) {
        lastPage = <LastPage {...pg.lastPage} component={linkComponent}/>;
        lastEllipsis =  <Ellipsis />;
    }
    reactStyle(
        {display: 'inline !important'},
        [min.sm, '.pagination.menu .item'],
        'pagination'
    );
    return (
        <Menu className="compact pagination">
        {firstPage}
        {firstEllipsis}
        {pg.list.map((v,k)=>{
            const current = pg.currentPage;
            if(v.currentPage){
                if ( (current.backward && current.backward.currentPage === v.currentPage) || 
                    (current.forward && current.forward.currentPage === v.currentPage)
                ) {
                    return null;
                }
                return <Page key={k} {...v} component={linkComponent}/>;
            } else {
                let re = [];
                if (current.backward) {
                    re.push(
                    <Backward
                        {...current.backward}
                        component={linkComponent}
                    />
                    );
                }
                re.push(<Current key={k} {...current[0]} component={linkComponent}/>);
                if (current.forward) {
                    re.push(
                    <Forward
                        {...current.forward}
                        component={linkComponent}
                        txtMore={txtMore}
                    />
                    );
                }
                return re;
            }
        })}
        {lastEllipsis}
        {lastPage}
        </Menu>
    );
}
Pagination.defaultProps = {
    linkComponent: 'a',
    txtMore: 'Next',
};
export default Pagination;