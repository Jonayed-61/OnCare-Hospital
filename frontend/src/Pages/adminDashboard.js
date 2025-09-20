import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaClinicMedical, 
  FaBlog, 
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaFilter,
  FaTimes,
  FaUserPlus,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaFileExport,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaLanguage,
  FaClock
} from 'react-icons/fa';
import '../Styles/adminDashboard.css';

const socket = io('http://localhost:5000');

function LiveChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    
    socket.on("users-list", (users) => {
      setConnectedUsers(users);
      if (users.length > 0 && !selectedUserId) {
        setSelectedUserId(users[0].userId);
      }
    });
    
    socket.emit("join-support", { agentId: "admin_1", agentName: "Admin" });
    
    return () => {
      socket.off("receive-message");
      socket.off("users-list");
    };
  }, []);

  const sendReply = () => {
    if (reply.trim() && selectedUserId) {
      // Emit to backend
      socket.emit("send-message", {
        message: reply,
        sender: "Admin",
        senderName: "Admin",
        targetUserId: selectedUserId,
        isSupport: true
      });

      // Add the message to local state immediately
      setMessages(prev => [
        ...prev,
        {
          message: reply,
          sender: "Admin",
          senderName: "Admin",
          targetUserId: selectedUserId,
          isSupport: true,
          timestamp: Date.now()
        }
      ]);

      setReply("");
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="live-chat-overlay">
      <div className="live-chat-panel">
        <div className="chat-header">
          <h2>Live Chat Support</h2>
          <button className="chat-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="chat-users">
          <label>Active Users:</label>
          <select 
            value={selectedUserId} 
            onChange={e => setSelectedUserId(e.target.value)}
            className="user-select"
          >
            {connectedUsers.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.userName} ({user.userId})
              </option>
            ))}
          </select>
        </div>
        
        <div className="chat-messages">
          {messages
            .filter(msg => {
              if (!selectedUserId) return true;
              return (
                msg.senderId === selectedUserId ||
                msg.targetUserId === selectedUserId ||
                msg.userId === selectedUserId
              );
            })
            .map((msg, idx) => (
              <div key={idx} className={msg.isSupport ? "admin-msg" : "user-msg"}>
                <strong>{msg.senderName || msg.sender || msg.userName}:</strong> 
                <span>{msg.message}</span>
                <span className="message-time">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            ))}
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply..."
            onKeyPress={(e) => e.key === 'Enter' && sendReply()}
          />
          <button 
            onClick={sendReply} 
            disabled={!selectedUserId || !reply.trim()}
            className="send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatingChatButton({ onClick, unreadCount }) {
  return (
    <button className="floating-chat-btn" onClick={onClick} title="Open Live Chat">
      💬
      {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
    </button>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    revenue: 0,
    newUsersThisMonth: 0,
    completedAppointments: 0,
    pendingApprovals: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const token = localStorage.getItem('adminToken');
    
    if (!isAuthenticated || !token) {
      navigate('/admin-login');
      return;
    }
    
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!isChatOpen) {
      socket.on("receive-message", () => {
        setUnreadMessages(prev => prev + 1);
      });
    } else {
      setUnreadMessages(0);
    }
    
    return () => {
      socket.off("receive-message");
    };
  }, [isChatOpen]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const doctorsResponse = await fetch('http://localhost:5000/api/admin/pending-doctors');
      if (!doctorsResponse.ok) throw new Error('Failed to fetch pending doctors');
      const doctorsData = await doctorsResponse.json();
      setPendingDoctors(Array.isArray(doctorsData) ? doctorsData : []);

      const usersResponse = await fetch('http://localhost:5000/api/admin/users');
      if (!usersResponse.ok) throw new Error('Failed to fetch users');
      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);

      const appointmentsResponse = await fetch('http://localhost:5000/api/admin/appointments');
      if (!appointmentsResponse.ok) throw new Error('Failed to fetch appointments');
      const appointmentsData = await appointmentsResponse.json();
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);

      const servicesResponse = await fetch('http://localhost:5000/api/admin/services');
      if (!servicesResponse.ok) throw new Error('Failed to fetch services');
      const servicesData = await servicesResponse.json();
      setServices(Array.isArray(servicesData) ? servicesData : []);

      const blogResponse = await fetch('http://localhost:5000/api/admin/blog-posts');
      if (!blogResponse.ok) throw new Error('Failed to fetch blog posts');
      const blogData = await blogResponse.json();
      setBlogPosts(Array.isArray(blogData) ? blogData : []);

      const statsResponse = await fetch('http://localhost:5000/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(prev => ({ ...prev, ...statsData }));
      }
      
      setStats(prev => ({
        ...prev,
        pendingApprovals: Array.isArray(doctorsData) ? doctorsData.length : 0
      }));

    } catch (error) {
      console.error('Error fetching data:', error);
      setAppointments([]);
      setUsers([]);
      setServices([]);
      setBlogPosts([]);
      setPendingDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    socket.disconnect();
    navigate('/admin-login');
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/approve-doctor/${doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPendingDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
        alert('Doctor approved successfully!');
      } else {
        alert('Failed to approve doctor');
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Error approving doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/reject-doctor/${doctorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPendingDoctors(prev => prev.filter(doctor => doctor._id !== doctorId));
        setStats(prev => ({ ...prev, pendingApprovals: prev.pendingApprovals - 1 }));
        alert('Doctor rejected successfully!');
      } else {
        alert('Failed to reject doctor');
      }
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      alert('Error rejecting doctor');
    }
  };

  const handleViewDoctor = (doctor) => {
    openModal({ type: 'viewDoctor', data: doctor });
  };

  const renderSection = () => {
    if (isLoading) {
      return <div className="loading-spinner">Loading dashboard data...</div>;
    }
    
    switch(activeSection) {
      case 'dashboard':
        return <DashboardOverview stats={stats} appointments={appointments} onViewAppointment={() => {}} pendingDoctors={pendingDoctors} onViewDoctor={handleViewDoctor} />;
      case 'users':
        return <UserManagement 
          users={users} 
          onAddUser={() => openModal('user')} 
          onEditUser={(user) => openModal({ type: 'editUser', data: user })} 
          onViewUser={(user) => openModal({ type: 'viewUser', data: user })} 
          onDeleteUser={async (userId) => {
            if (window.confirm('Are you sure you want to delete this user?')) {
              try {
                const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  setUsers(users.filter(user => user._id !== userId));
                  alert('User deleted successfully');
                } else {
                  alert('Failed to delete user');
                }
              } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user');
              }
            }
          }}
          searchTerm={searchTerm}
        />;
      case 'appointments':
        return <AppointmentManagement 
          appointments={appointments} 
          onAddAppointment={() => openModal('appointment')} 
          onEditAppointment={(appt) => openModal({ type: 'editAppointment', data: appt })} 
          onViewAppointment={(appt) => openModal({ type: 'viewAppointment', data: appt })} 
          onDeleteAppointment={async (apptId) => {
            if (window.confirm('Are you sure you want to delete this appointment?')) {
              try {
                const response = await fetch(`http://localhost:5000/api/admin/appointments/${apptId}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  setAppointments(appointments.filter(appt => appt._id !== apptId));
                  alert('Appointment deleted successfully');
                } else {
                  alert('Failed to delete appointment');
                }
              } catch (error) {
                console.error('Error deleting appointment:', error);
                alert('Error deleting appointment');
              }
            }
          }}
          searchTerm={searchTerm}
        />;
      case 'services':
        return <ServiceManagement 
          services={services} 
          onAddService={() => openModal('service')} 
          onEditService={(service) => openModal({ type: 'editService', data: service })} 
          onDeleteService={async (serviceId) => {
            if (window.confirm('Are you sure you want to delete this service?')) {
              try {
                const response = await fetch(`http://localhost:5000/api/admin/services/${serviceId}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  setServices(services.filter(service => service._id !== serviceId));
                  alert('Service deleted successfully');
                } else {
                  alert('Failed to delete service');
                }
              } catch (error) {
                console.error('Error deleting service:', error);
                alert('Error deleting service');
              }
            }
          }}
        />;
      case 'blog':
        return <BlogManagement 
          posts={blogPosts} 
          onAddPost={() => openModal('blog post')} 
          onEditPost={(post) => openModal({ type: 'editBlogPost', data: post })} 
          onDeletePost={async (postId) => {
            if (window.confirm('Are you sure you want to delete this blog post?')) {
              try {
                const response = await fetch(`http://localhost:5000/api/admin/blog-posts/${postId}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  setBlogPosts(blogPosts.filter(post => post._id !== postId));
                  alert('Blog post deleted successfully');
                } else {
                  alert('Failed to delete blog post');
                }
              } catch (error) {
                console.error('Error deleting blog post:', error);
                alert('Error deleting blog post');
              }
            }
          }}
          searchTerm={searchTerm}
        />;
      case 'analytics':
        return <Analytics stats={stats} />;
      case 'doctor-approvals':
        return <DoctorApprovalManagement 
          pendingDoctors={pendingDoctors} 
          onApproveDoctor={handleApproveDoctor}
          onRejectDoctor={handleRejectDoctor}
          onViewDoctor={handleViewDoctor}
        />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview stats={stats} appointments={appointments} onViewAppointment={() => {}} pendingDoctors={pendingDoctors} onViewDoctor={handleViewDoctor} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
      <div className="admin-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {renderSection()}
        <FloatingChatButton 
          onClick={() => {
            setIsChatOpen(true);
            setUnreadMessages(0);
          }} 
          unreadCount={unreadMessages} 
        />
        <LiveChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
      {isModalOpen && (
        <Modal content={modalContent} onClose={closeModal} onSave={fetchData} />
      )}
    </div>
  );
}

function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { id: 'services', label: 'Services', icon: <FaClinicMedical /> },
    { id: 'blog', label: 'Blog', icon: <FaBlog /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'doctor-approvals', label: 'Doctor Approvals', icon: <FaUserMd /> },
    { id: 'settings', label: 'Settings', icon: <FaCog /> }
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>OnCare Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <button 
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function Header({ searchTerm, setSearchTerm }) {
  return (
    <div className="admin-header">
      <div className="search-bar">
        <FaSearch />
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="admin-profile">
        <div className="profile-info">
          <span className="admin-name">Admin User</span>
          <span className="admin-role">Administrator</span>
        </div>
        <div className="profile-avatar">
          A
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ stats, appointments, onViewAppointment, pendingDoctors, onViewDoctor }) {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safePendingDoctors = Array.isArray(pendingDoctors) ? pendingDoctors : [];

  return (
    <div className="dashboard-section">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
            <span className="stat-subtext">+{stats.newUsersThisMonth} this month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon appointments">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>{stats.totalAppointments}</h3>
            <p>Total Appointments</p>
            <span className="stat-subtext">{stats.completedAppointments} completed</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending Appointments</p>
            <span className="stat-subtext">Need attention</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaMoneyBillWave />
          </div>
          <div className="stat-info">
            <h3>৳{stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-subtext">Current month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon approvals">
            <FaUserMd />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
            <span className="stat-subtext">Doctor registrations</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="recent-appointments">
          <h2>Recent Appointments</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeAppointments.slice(0, 5).map(appointment => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</td>
                  <td>{appointment.service}</td>
                  <td>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => onViewAppointment(appointment)}
                      >
                        <FaEye />
                      </button>
                      <button className="edit-btn"><FaEdit /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {safeAppointments.length === 0 && (
            <p className="no-data">No appointments found</p>
          )}
        </div>
        
        <div className="pending-approvals">
          <h2>Pending Doctor Approvals</h2>
          {safePendingDoctors.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safePendingDoctors.slice(0, 3).map(doctor => (
                  <tr key={doctor._id}>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialty}</td>
                    <td>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge pending">
                        Pending
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="view-btn"
                          onClick={() => onViewDoctor(doctor)}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No pending doctor approvals</p>
          )}
          {safePendingDoctors.length > 3 && (
            <div className="view-all-container">
              <button 
                className="view-all-btn"
                onClick={() => window.location.hash = '#doctor-approvals'}
              >
                View All ({safePendingDoctors.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorApprovalManagement({ pendingDoctors, onApproveDoctor, onRejectDoctor, onViewDoctor }) {
  const safePendingDoctors = Array.isArray(pendingDoctors) ? pendingDoctors : [];

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Doctor Registration Approvals</h1>
        <p>Review and approve doctor registrations before they appear on the website</p>
      </div>
      
      {safePendingDoctors.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Specialty</th>
                <th>Experience</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safePendingDoctors.map(doctor => (
                <tr key={doctor._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {doctor.name.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{doctor.name}</div>
                        <div className="user-email">{doctor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{doctor.email}</td>
                  <td>{doctor.specialty}</td>
                  <td>{doctor.experience} years</td>
                  <td>{new Date(doctor.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge pending">
                      Pending Review
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => onViewDoctor(doctor)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="approve-btn"
                        onClick={() => onApproveDoctor(doctor._id)}
                        title="Approve Doctor"
                      >
                        <FaCheckCircle />
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => onRejectDoctor(doctor._id)}
                        title="Reject Application"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">
          <p>No pending doctor registrations for approval</p>
        </div>
      )}
    </div>
  );
}

function UserManagement({ users, onAddUser, onEditUser, onViewUser, onDeleteUser, searchTerm }) {
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>User Management</h1>
        <button className="btn-primary" onClick={onAddUser}>
          <FaUserPlus /> Add New User
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-phone">{user.phone}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => onViewUser(user)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => onEditUser(user)}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteUser(user._id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <p className="no-data">No users found</p>
        )}
      </div>
    </div>
  );
}

function AppointmentManagement({ appointments, onAddAppointment, onEditAppointment, onViewAppointment, onDeleteAppointment, searchTerm }) {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = safeAppointments.filter(appt => 
    appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appt.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Appointment Management</h1>
        <button className="btn-primary" onClick={onAddAppointment}>
          <FaPlus /> New Appointment
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>Service</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment._id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</td>
                <td>{appointment.service}</td>
                <td>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => onViewAppointment(appointment)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => onEditAppointment(appointment)}
                      title="Edit Appointment"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteAppointment(appointment._id)}
                      title="Delete Appointment"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && (
          <p className="no-data">No appointments found</p>
        )}
      </div>
    </div>
  );
}

function ServiceManagement({ services, onAddService, onEditService, onDeleteService }) {
  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Service Management</h1>
        <button className="btn-primary" onClick={onAddService}>
          <FaPlus /> Add New Service
        </button>
      </div>
      
      <div className="services-grid">
        {safeServices.map(service => (
          <div key={service._id} className="service-card">
            <div className="service-header">
              <h3>{service.name}</h3>
              <span className="service-price">৳{service.price}</span>
            </div>
            <p className="service-description">{service.description}</p>
            <div className="service-details">
              <span className="service-duration">{service.duration}</span>
              <span className={`service-status ${service.status}`}>{service.status}</span>
            </div>
            <div className="service-actions">
              <button 
                className="edit-btn"
                onClick={() => onEditService(service)}
                title="Edit Service"
              >
                <FaEdit />
              </button>
              <button 
                className="delete-btn"
                onClick={() => onDeleteService(service._id)}
                title="Delete Service"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
        {safeServices.length === 0 && (
          <p className="no-data">No services found</p>
        )}
      </div>
    </div>
  );
}

function BlogManagement({ posts, onAddPost, onEditPost, onDeletePost, searchTerm }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const filteredPosts = safePosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Blog Management</h1>
        <button className="btn-primary" onClick={onAddPost}>
          <FaPlus /> New Blog Post
        </button>
      </div>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Publish Date</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.category}</td>
                <td>{new Date(post.date).toLocaleDateString()}</td>
                <td>{post.views}</td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-btn"
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      title="View Post"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => onEditPost(post)}
                      title="Edit Post"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeletePost(post._id)}
                      title="Delete Post"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPosts.length === 0 && (
          <p className="no-data">No blog posts found</p>
        )}
      </div>
    </div>
  );
}

function Analytics({ stats }) {
  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Analytics & Reports</h1>
        <button className="btn-primary">
          <FaFileExport /> Export Report
        </button>
      </div>
      
      <div className="analytics-content">
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>User Growth</h3>
            <div className="chart-placeholder">
              <p>User growth chart would be displayed here</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Appointment Trends</h3>
            <div className="chart-placeholder">
              <p>Appointment trends chart would be displayed here</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Revenue Analysis</h3>
            <div className="chart-placeholder">
              <p>Revenue analysis chart would be displayed here</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <h3>Service Popularity</h3>
            <div className="chart-placeholder">
              <p>Service popularity chart would be displayed here</p>
            </div>
          </div>
        </div>
        
        <div className="detailed-stats">
          <h3>Detailed Statistics</h3>
          <div className="stats-details">
            <div className="stat-detail-item">
              <span className="stat-label">Monthly Active Users</span>
              <span className="stat-value">1,245</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">Appointment Completion Rate</span>
              <span className="stat-value">85%</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">Average Revenue Per User</span>
              <span className="stat-value">৳1,200</span>
            </div>
            <div className="stat-detail-item">
              <span className="stat-label">New Users This Week</span>
              <span className="stat-value">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoApproveDoctors: false,
    maintenanceMode: false
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="management-section">
      <div className="section-header">
        <h1>System Settings</h1>
      </div>
      
      <div className="settings-content">
        <div className="settings-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.notifications}
                onChange={() => handleSettingChange('notifications')}
              />
              <span className="slider"></span>
            </label>
            <span className="setting-label">Enable Notifications</span>
          </div>
          
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.emailAlerts}
                onChange={() => handleSettingChange('emailAlerts')}
              />
              <span className="slider"></span>
            </label>
            <span className="setting-label">Email Alerts</span>
          </div>
        </div>
        
        <div className="settings-card">
          <h3>System Configuration</h3>
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.autoApproveDoctors}
                onChange={() => handleSettingChange('autoApproveDoctors')}
              />
              <span className="slider"></span>
            </label>
            <span className="setting-label">Auto-approve Doctors</span>
          </div>
          
          <div className="setting-item">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode}
                onChange={() => handleSettingChange('maintenanceMode')}
              />
              <span className="slider"></span>
            </label>
            <span className="setting-label">Maintenance Mode</span>
          </div>
        </div>
        
        <div className="settings-card">
          <h3>System Information</h3>
          <div className="system-info">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">v2.1.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated</span>
              <span className="info-value">2024-01-15</span>
            </div>
            <div className="info-item">
              <span className="info-label">Database Size</span>
              <span className="info-value">245 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ content, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (content && content.data) {
      setFormData(content.data);
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onSave();
    onClose();
  };

  const renderContent = () => {
    if (!content) return null;
    
    switch(content.type) {
      case 'viewDoctor':
        const doctor = content.data;
        return (
          <div className="modal-view-doctor">
            <h2>Doctor Details</h2>
            <div className="doctor-details">
              <div className="detail-row">
                <label>Name:</label>
                <span>{doctor.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{doctor.email}</span>
              </div>
              <div className="detail-row">
                <label>Specialty:</label>
                <span>{doctor.specialty}</span>
              </div>
              <div className="detail-row">
                <label>Experience:</label>
                <span>{doctor.experience} years</span>
              </div>
              <div className="detail-row">
                <label>Education:</label>
                <span>{doctor.education}</span>
              </div>
              <div className="detail-row">
                <label>Languages:</label>
                <span>{doctor.languages?.join(', ')}</span>
              </div>
              <div className="detail-row">
                <label>Applied On:</label>
                <span>{new Date(doctor.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      
      case 'viewUser':
        const user = content.data;
        return (
          <div className="modal-view-user">
            <h2>User Details</h2>
            <div className="user-details">
              <div className="detail-row">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
              <div className="detail-row">
                <label>Role:</label>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${user.status}`}>{user.status}</span>
              </div>
              <div className="detail-row">
                <label>Join Date:</label>
                <span>{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="modal-default">
            <h2>{content.type || 'Modal'}</h2>
            <p>This modal content is not implemented yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        {renderContent()}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          {content && content.type !== 'viewDoctor' && content.type !== 'viewUser' && (
            <button className="btn-primary" onClick={handleSubmit}>Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}