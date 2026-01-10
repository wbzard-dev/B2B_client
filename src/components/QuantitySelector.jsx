import React from 'react';

const QuantitySelector = ({ value, onChange, min = 0, max = Infinity, unit = '' }) => {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleChange = (e) => {
        const val = parseInt(e.target.value);
        if (isNaN(val)) {
            onChange(0);
        } else {
            onChange(Math.min(Math.max(val, min), max));
        }
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'var(--surface-alt)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid var(--border)',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            userSelect: 'none'
        }}>
            <button
                onClick={handleDecrement}
                disabled={value <= min}
                className="quantity-btn"
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: value <= min ? 'transparent' : 'white',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: value <= min ? 'not-allowed' : 'pointer',
                    fontSize: '1.25rem',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: value <= min ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                    opacity: value <= min ? 0.3 : 1
                }}
            >
                &minus;
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-main)',
                        padding: '0',
                        margin: '0',
                        outline: 'none'
                    }}
                />
                {unit && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{unit}</span>}
            </div>
            <button
                onClick={handleIncrement}
                disabled={value >= max}
                className="quantity-btn"
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: 'none',
                    background: value >= max ? 'transparent' : 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: value >= max ? 'not-allowed' : 'pointer',
                    fontSize: '1.25rem',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: value >= max ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
                    opacity: value >= max ? 0.3 : 1
                }}
            >
                &#43;
            </button>
            <style>
                {`
                    .quantity-btn:hover:not(:disabled) {
                        transform: translateY(-1px);
                        filter: brightness(1.05);
                    }
                    .quantity-btn:active:not(:disabled) {
                        transform: translateY(0px) scale(0.95);
                    }
                `}
            </style>
        </div>
    );
};

export default QuantitySelector;
