import React from 'react';
import PropTypes from 'prop-types';
import { ObjectUtils, classNames } from '../utils/Utils';

export const Steps = (props) => {
    const itemClick = (event, item, index) => {
        if (props.readOnly || item.disabled) {
            event.preventDefault();
            return;
        }

        if (props.onSelect) {
            props.onSelect({
                originalEvent: event,
                item,
                index
            });
        }

        if (!item.url) {
            event.preventDefault();
        }

        if (item.command) {
            item.command({
                originalEvent: event,
                item,
                index
            });
        }
    }

    const useItem = (item, index) => {
        const active = index === props.activeIndex;
        const disabled = (item.disabled || (index !== props.activeIndex && props.readOnly))
        const className = classNames('p-steps-item', item.className, {
            'p-highlight p-steps-current': active,
            'p-disabled': disabled
        });
        const label = item.label && <span className="p-steps-title">{item.label}</span>;
        const tabIndex = disabled ? -1 : '';
        let content = (
            <a href={item.url || '#'} className="p-menuitem-link" role="presentation" target={item.target} onClick={event => itemClick(event, item, index)} tabIndex={tabIndex} aria-disabled={disabled}>
                <span className="p-steps-number">{index + 1}</span>
                {label}
            </a>
        );

        if (item.template) {
            const defaultContentOptions = {
                onClick: (event) => itemClick(event, item, index),
                className: 'p-menuitem-link',
                labelClassName: 'p-steps-title',
                numberClassName: 'p-steps-number',
                element: content,
                props,
                tabIndex,
                active,
                disabled
            };

            content = ObjectUtils.getJSXElement(item.template, item, defaultContentOptions);
        }

        return (
            <li key={item.label + '_' + index} className={className} style={item.style} role="tab" aria-selected={active} aria-expanded={active}>
                {content}
            </li>
        );
    }

    const useItems = () => {
        if (props.model) {
            const items = props.model.map((item, index) => {
                return useItem(item, index);
            });

            return (
                <ul role="tablist">
                    {items}
                </ul>
            );
        }

        return null;
    }

    const className = classNames('p-steps p-component', props.className, { 'p-readonly': props.readOnly });
    const items = useItems();

    return (
        <div id={props.id} className={className} style={props.style}>
            {items}
        </div>
    )
}

Steps.defaultProps = {
    id: null,
    model: null,
    activeIndex: 0,
    readOnly: true,
    style: null,
    className: null,
    onSelect: null
}

Steps.propTypes = {
    id: PropTypes.string,
    model: PropTypes.array.isRequired,
    activeIndex: PropTypes.number,
    readOnly: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    onSelect: PropTypes.func
}
