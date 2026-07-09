import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { accountAPI } from '../services/api';
import {
    Landmark, Plus, LandmarkIcon, LogOut,
    ArrowUpRight, ArrowDownLeft, RefreshCcw, User, Calendar
} from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [accounts, setAccounts] = useState([]);
    const [activeAccount, setActiveAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [txType, setTxType] = useState('DEPOSIT'); // DEPOSIT or WITHDRAWAL
    const [accountType, setAccountType] = useState('SAVINGS'); // SAVINGS or CHECKING

    // Form fields
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        if (activeAccount) {
            fetchTransactions(activeAccount.accountNumber);
        } else {
            setTransactions([]);
        }
    }, [activeAccount]);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const response = await accountAPI.getMyAccounts();
            setAccounts(response.data);
            if (response.data.length > 0) {
                // Keep active account selected if still present, otherwise default to first
                const currentActive = activeAccount
                    ? response.data.find(a => a.accountNumber === activeAccount.accountNumber)
                    : null;
                setActiveAccount(currentActive || response.data[0]);
            } else {
                setActiveAccount(null);
            }
        } catch (err) {
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTransactions = async (accNum) => {
        try {
            const response = await accountAPI.getTransactions(accNum);
            setTransactions(response.data);
        } catch (err) {
            console.error('Error fetching transactions:', err);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setModalError('');
        setModalSuccess('');
        try {
            const response = await accountAPI.createAccount(accountType);
            setModalSuccess(`Successfully created your ${accountType.toLowerCase()} account!`);
            setTimeout(() => {
                setShowCreateModal(false);
                setModalSuccess('');
                fetchAccounts();
            }, 1000);
        } catch (err) {
            setModalError(err.response?.data?.message || 'Failed to create account.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setModalError('Please enter a valid amount greater than zero.');
            return;
        }
        setSubmitting(true);
        setModalError('');
        setModalSuccess('');
        try {
            if (txType === 'DEPOSIT') {
                await accountAPI.deposit(activeAccount.accountNumber, amount, description);
                setModalSuccess('Deposit successful!');
            } else {
                await accountAPI.withdraw(activeAccount.accountNumber, amount, description);
                setModalSuccess('Withdrawal successful!');
            }

            setAmount('');
            setDescription('');
            setTimeout(() => {
                setShowTransactionModal(false);
                setModalSuccess('');
                fetchAccounts(); // Refetches and keeps activeAccount updated
            }, 1000);
        } catch (err) {
            setModalError(err.response?.data?.message || 'Transaction failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-container">
            <div className="accent-glow-1"></div>
            <div className="accent-glow-2"></div>

            {/* Sidebar */}
            <div className="sidebar">
                <div className="brand">
                    <Landmark className="brand-icon" size={28} />
                    <span>Apex Trust</span>
                </div>

                <ul className="nav-list">
                    <li className="nav-link active">
                        <LandmarkIcon size={18} />
                        <span>Dashboard</span>
                    </li>
                </ul>

                <div style={{ marginTop: 'auto' }}>
                    <div className="user-info" style={{ marginBottom: '24px' }}>
                        <div className="user-avatar">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '15px', fontWeight: 600 }}>{user?.username}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cardholder</div>
                        </div>
                    </div>
                    <button className="nav-link" onClick={logout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Main Panel */}
            <div className="main-content">
                <div className="header-row">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>Financial Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Welcome back, {user?.username}!</p>
                    </div>
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        <span>Create Account</span>
                    </button>
                </div>

                {loading && accounts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px' }}>
                        <RefreshCcw className="spin" size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
                        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading account information...</p>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="empty-state glass">
                        <LandmarkIcon className="empty-state-icon" size={48} />
                        <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No Active Bank Accounts</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                            You do not have any registered accounts. Setup your first Checking or Savings account today to start handling money.
                        </p>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} />
                            <span>Create Account Now</span>
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Accounts list grid */}
                        <div className="cards-grid">
                            {accounts.map((acc) => (
                                <div
                                    key={acc.accountNumber}
                                    className={`account-card glass ${acc.accountType === 'CHECKING' ? 'checking' : ''} ${activeAccount?.accountNumber === acc.accountNumber ? 'active' : ''}`}
                                    onClick={() => setActiveAccount(acc)}
                                    style={{
                                        cursor: 'pointer',
                                        borderColor: activeAccount?.accountNumber === acc.accountNumber ? 'var(--accent-primary)' : 'var(--border-color)',
                                        background: activeAccount?.accountNumber === acc.accountNumber ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)'
                                    }}
                                >
                                    <div className="card-bg-glow"></div>
                                    <div className="card-header">
                                        <div>
                                            <div className="card-type">{acc.accountType}</div>
                                            <div className="card-number">#{acc.accountNumber}</div>
                                        </div>
                                        <Landmark size={20} style={{ color: acc.accountType === 'CHECKING' ? 'var(--accent-success)' : 'var(--accent-primary)' }} />
                                    </div>
                                    <div className="card-balance">
                                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Selected Account Operations */}
                        {activeAccount && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
                                {/* Transaction History Panel */}
                                <div className="transactions-panel glass">
                                    <div className="panel-header">
                                        <div>
                                            <h3 className="panel-title">Transaction History</h3>
                                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                                Account #{activeAccount.accountNumber} ({activeAccount.accountType.toLowerCase()})
                                            </p>
                                        </div>
                                    </div>

                                    {transactions.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            No transactions recorded yet for this account.
                                        </div>
                                    ) : (
                                        <div className="transaction-list">
                                            {transactions.map((tx) => (
                                                <div key={tx.id} className="transaction-item">
                                                    <div className="tx-left">
                                                        <div className={`tx-icon ${tx.transactionType.toLowerCase()}`}>
                                                            {tx.transactionType === 'DEPOSIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                        </div>
                                                        <div className="tx-details">
                                                            <h4>{tx.description}</h4>
                                                            <p>{tx.transactionType === 'DEPOSIT' ? 'Deposit received' : 'Withdrawal completed'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="tx-right">
                                                        <span className={`tx-amount ${tx.transactionType.toLowerCase()}`}>
                                                            {tx.transactionType === 'DEPOSIT' ? '+' : '-'}
                                                            ${tx.amount.toFixed(2)}
                                                        </span>
                                                        <div className="tx-date">{formatDate(tx.timestamp)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Actions Panel */}
                                <div className="glass" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Quick Actions</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setTxType('DEPOSIT');
                                                setShowTransactionModal(true);
                                            }}
                                            style={{ background: 'var(--accent-success)', hoverBackground: 'var(--accent-success-hover)' }}
                                        >
                                            <ArrowDownLeft size={18} />
                                            <span>Deposit Money</span>
                                        </button>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setTxType('WITHDRAWAL');
                                                setShowTransactionModal(true);
                                            }}
                                            style={{ background: 'var(--accent-primary)' }}
                                        >
                                            <ArrowUpRight size={18} />
                                            <span>Withdraw Money</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal: Create Account */}
                {showCreateModal && (
                    <div className="modal-overlay">
                        <div className="modal-content glass">
                            <div className="modal-header">
                                <h3 className="modal-title">Open New Account</h3>
                                <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
                            </div>

                            {modalError && <div className="alert alert-error">{modalError}</div>}
                            {modalSuccess && <div className="alert alert-success">{modalSuccess}</div>}

                            <form onSubmit={handleCreateAccount}>
                                <div className="form-group">
                                    <label className="form-label">Select Account Category</label>
                                    <div className="grid-select">
                                        <div
                                            className={`select-card ${accountType === 'SAVINGS' ? 'selected' : ''}`}
                                            onClick={() => setAccountType('SAVINGS')}
                                        >
                                            <div className="select-card-title">Savings Account</div>
                                            <div className="select-card-desc">Accrue interest on deposits</div>
                                        </div>
                                        <div
                                            className={`select-card ${accountType === 'CHECKING' ? 'selected' : ''}`}
                                            onClick={() => setAccountType('CHECKING')}
                                        >
                                            <div className="select-card-title">Checking Account</div>
                                            <div className="select-card-desc">Flexible daily transactions</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Opening...' : 'Open Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal: Deposit / Withdraw */}
                {showTransactionModal && (
                    <div className="modal-overlay">
                        <div className="modal-content glass">
                            <div className="modal-header">
                                <h3 className="modal-title">{txType === 'DEPOSIT' ? 'Deposit Funds' : 'Withdraw Funds'}</h3>
                                <button className="close-btn" onClick={() => setShowTransactionModal(false)}>✕</button>
                            </div>

                            {modalError && <div className="alert alert-error">{modalError}</div>}
                            {modalSuccess && <div className="alert alert-success">{modalSuccess}</div>}

                            <form onSubmit={handleTransactionSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Amount ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        className="form-input"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description / Note</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={txType === 'DEPOSIT' ? 'E.g. ATM Deposit, payroll' : 'E.g. Utilities, groceries'}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Processing...' : 'Confirm'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
