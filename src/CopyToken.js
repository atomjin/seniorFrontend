import React from 'react';
import { useLocation } from 'react-router-dom';

function CopyToken() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h1>Copy Your WebSocket API Token</h1>
            {token ? (
                <>
                    <textarea
                        readOnly
                        value={token}
                        style={{
                            width: '80%',
                            height: '100px',
                            fontSize: '16px',
                            padding: '10px',
                        }}
                    />
                    <br />
                    <button
                        onClick={() => navigator.clipboard.writeText(token)}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '10px',
                        }}
                    >
                        Copy Token
                    </button>
                </>
            ) : (
                <p style={{ color: 'red' }}>No token found! Make sure to get the token first.</p>
            )}
        </div>
    );
}

export default CopyToken;
