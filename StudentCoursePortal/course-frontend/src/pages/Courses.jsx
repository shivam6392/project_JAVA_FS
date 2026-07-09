import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, User as UserIcon, Plus, Trash2, Edit2, LogOut, CheckCircle, Info } from 'lucide-react';

const Courses = () => {
    const { user, logout } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Admin Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formCode, setFormCode] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formInstructor, setFormInstructor] = useState('');
    const [formCapacity, setFormCapacity] = useState(30);

    const fetchPortalData = async () => {
        try {
            setLoading(true);
            setError(null);

            const coursesRes = await api.get('/courses');
            setCourses(coursesRes.data);

            if (user && user.role === 'ROLE_STUDENT') {
                const enrolledRes = await api.get('/students/courses');
                setEnrolledIds(enrolledRes.data.map(c => c.id));
            }
        } catch (err) {
            setError('Failed to fetch portal catalog data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortalData();
    }, [user]);

    const handleEnroll = async (courseId) => {
        setError(null);
        setSuccess(null);
        try {
            await api.post(`/students/courses/${courseId}/enroll`);
            setSuccess('Enrolled successfully!');
            fetchPortalData();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Enrollment failed.');
            }
        }
    };

    const handleUnenroll = async (courseId) => {
        setError(null);
        setSuccess(null);
        try {
            await api.post(`/students/courses/${courseId}/unenroll`);
            setSuccess('Unenrolled successfully!');
            fetchPortalData();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Unenrollment failed.');
            }
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        setError(null);
        setSuccess(null);
        try {
            await api.delete(`/courses/${courseId}`);
            setSuccess('Course deleted.');
            fetchPortalData();
        } catch (err) {
            setError('Failed to delete course.');
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormCode('');
        setFormTitle('');
        setFormDesc('');
        setFormInstructor('');
        setFormCapacity(30);
        setShowModal(true);
    };

    const handleOpenEditModal = (course) => {
        setIsEditing(true);
        setCurrentId(course.id);
        setFormCode(course.code);
        setFormTitle(course.title);
        setFormDesc(course.description || '');
        setFormInstructor(course.instructor);
        setFormCapacity(course.capacity);
        setShowModal(true);
    };

    const handleSubmitAdminForm = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const payload = {
            code: formCode,
            title: formTitle,
            description: formDesc,
            instructor: formInstructor,
            capacity: parseInt(formCapacity)
        };

        try {
            if (isEditing) {
                await api.put(`/courses/${currentId}`, payload);
                setSuccess('Course updated successfully.');
            } else {
                await api.post('/courses', payload);
                setSuccess('Course added successfully.');
            }
            setShowModal(false);
            fetchPortalData();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Save failed.');
            }
        }
    };

    return (
        <div className="portal-container">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <div className="logo-section">
                    <BookOpen size={28} style={{ color: '#a855f7' }} />
                    <span>Apex Portal</span>
                </div>

                <div className="nav-menu">
                    <div className="nav-item active">
                        <BookOpen size={18} />
                        <span>Course Catalog</span>
                    </div>
                </div>

                <div className="user-profile-badge">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50%' }}>
                            <UserIcon size={20} style={{ color: '#a855f7' }} />
                        </div>
                        <div>
                            <div className="user-badge-name">{user ? user.username : 'User'}</div>
                            <div className="user-badge-role">{user ? user.role.replace('ROLE_', '') : ''}</div>
                        </div>
                    </div>
                    <button
                        className="btn btn-danger"
                        onClick={logout}
                        style={{ width: '100%', marginTop: '20px', padding: '8px', fontSize: '0.85rem', justifyContent: 'center' }}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Panel Content */}
            <div className="main-content">
                <div className="content-header">
                    <div>
                        <h1>Course Registration Directory</h1>
                        <p style={{ color: '#a1a1aa', marginTop: '6px' }}>
                            {user && user.role === 'ROLE_ADMIN' ? 'Manage curriculum schedules and records' : 'Browse academic modules and enroll'}
                        </p>
                    </div>
                    {user && user.role === 'ROLE_ADMIN' && (
                        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
                            <Plus size={18} />
                            Add Course
                        </button>
                    )}
                </div>

                {error && (
                    <div className="notification notification-error">
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="notification notification-success">
                        <span>{success}</span>
                    </div>
                )}

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '80px', color: '#a1a1aa' }}>Loading modules...</div>
                ) : (
                    <div className="courses-grid">
                        {courses.map((course) => {
                            const isEnrolled = enrolledIds.includes(course.id);
                            const isFull = course.enrolledCount >= course.capacity;
                            const fillPercentage = Math.min(100, (course.enrolledCount / course.capacity) * 100);

                            return (
                                <div key={course.id} className="course-card glass-container">
                                    <div className="course-code-badge">{course.code}</div>
                                    <h3 className="course-title">{course.title}</h3>
                                    <div className="course-instructor">with {course.instructor}</div>
                                    <p className="course-desc">
                                        {course.description || 'No course description available at this time.'}
                                    </p>

                                    <div className="course-capacity-bar">
                                        <div className="course-capacity-fill" style={{ width: `${fillPercentage}%` }}></div>
                                    </div>
                                    <div className="course-capacity-text">
                                        <span>{course.enrolledCount} / {course.capacity} enrolled</span>
                                        {isEnrolled && (
                                            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <CheckCircle size={14} /> Enrolled
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                        {user && user.role === 'ROLE_ADMIN' ? (
                                            <>
                                                <button className="btn btn-secondary" onClick={() => handleOpenEditModal(course)} style={{ padding: '8px 12px', flexGrow: 1, justifyContent: 'center' }}>
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)} style={{ padding: '8px 12px' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            isEnrolled ? (
                                                <button className="btn btn-secondary" onClick={() => handleUnenroll(course.id)} style={{ width: '100%', justifyContent: 'center' }}>
                                                    Unenroll
                                                </button>
                                            ) : (
                                                <button className="btn btn-primary" onClick={() => handleEnroll(course.id)} style={{ width: '100%', justifyContent: 'center' }} disabled={isFull}>
                                                    {isFull ? 'Class Full' : 'Enroll Now'}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {courses.length === 0 && (
                            <div className="glass-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#a1a1aa', borderStyle: 'dashed' }}>
                                <Info size={32} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
                                <h3>No courses currently available</h3>
                                <p style={{ marginTop: '6px' }}>Check back later or contact your administrator.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Admin Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-container">
                        <h2 className="modal-title">{isEditing ? 'Modify Academic Course' : 'Create Academic Course'}</h2>

                        <form onSubmit={handleSubmitAdminForm}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="code">Course Code</label>
                                <input
                                    id="code"
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. CS101"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="title">Course Title</label>
                                <input
                                    id="title"
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. Introduction to Programming"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="instructor">Instructor Name</label>
                                <input
                                    id="instructor"
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. Dr. Alan Turing"
                                    value={formInstructor}
                                    onChange={(e) => setFormInstructor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="capacity">Capacity Limit</label>
                                <input
                                    id="capacity"
                                    className="form-input"
                                    type="number"
                                    placeholder="e.g. 30"
                                    value={formCapacity}
                                    onChange={(e) => setFormCapacity(e.target.value)}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="desc">Description</label>
                                <textarea
                                    id="desc"
                                    className="form-input"
                                    placeholder="Provide details about the course sylabus..."
                                    value={formDesc}
                                    onChange={(e) => setFormDesc(e.target.value)}
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" type="submit">
                                    {isEditing ? 'Save Changes' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Courses;
