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
  FaFileExport
} from 'react-icons/fa';
import '../Styles/adminDashboard.css';

const socket = io('http://localhost:5000'); // Adjust if backend runs elsewhere

function LiveChatPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("users-list", (users) => {
      if (users.length > 0 && !selectedUserId) {
        setSelectedUserId(users[0].userId);
      }
    });
    // Join as support agent (only once)
    socket.emit("join-support", { agentId: "admin_1", agentName: "Admin" });
    return () => {
      socket.off("receive-message");
      socket.off("users-list");
    };
    // eslint-disable-next-line
  }, []);

  const sendReply = () => {
    if (reply.trim() && selectedUserId) {
      // Debug log for admin message sending
      console.log("Admin sending message to:", selectedUserId, "Message:", reply);
      socket.emit("send-message", {
        message: reply,
        sender: "Admin",
        senderName: "Admin",
        targetUserId: selectedUserId,
        isSupport: true,
        senderId: "admin_1"
      });
      setReply("");
    } else {
      console.warn("Admin cannot send message: No user selected or message empty.");
    }
  }

  if (!isOpen) return null;
  // Get all unique userIds from messages for dropdown
  const userIds = messages
    .filter(msg => msg.senderId && !msg.isSupport)
    .map(msg => msg.senderId)
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="live-chat-overlay">
      <div className="live-chat-panel">
        <div className="chat-header">
          <h2>Live Chat</h2>
          <button className="chat-close-btn" onClick={onClose}>d7</button>
        </div>
        <div className="chat-users">
          <label>Select User:</label>
          <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            {userIds.map(userId => (
              <option key={userId} value={userId}>{userId}</option>
            ))}
          </select>
        </div>
        <div className="chat-messages">
          {messages
            .filter(msg => {
              // Show all messages for selected user
              if (!selectedUserId) return true;
              return (
                msg.senderId === selectedUserId ||
                msg.targetUserId === selectedUserId ||
                msg.userId === selectedUserId
              );
            })
            .map((msg, idx) => (
              <div key={idx} className={msg.isSupport ? "admin-msg" : "user-msg"}>
                <strong>{msg.senderName || msg.sender || msg.userName}:</strong> {msg.message}
              </div>
            ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply..."
          />
          <button onClick={sendReply} disabled={!selectedUserId}>Send</button>
        </div>
      </div>
    </div>
  );
}

function FloatingChatButton({ onClick }) {
  return (
    <button className="floating-chat-btn" onClick={onClick} title="Open Live Chat">
      💬
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    revenue: 0,
    newUsersThisMonth: 0,
    completedAppointments: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/login');
  };

  // Fetch data from API
  useEffect(() => {
    // In a real application, you would fetch data from your API
    const fetchData = async () => {
      try {
        // Example API calls (replace with your actual endpoints)
        /*
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        const appointmentsResponse = await fetch('/api/appointments');
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
        
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
        
        const blogResponse = await fetch('/api/blog-posts');
        const blogData = await blogResponse.json();
        setBlogPosts(blogData);
        
        const statsResponse = await fetch('/api/stats');
        const statsData = await statsResponse.json();
        setStats(statsData);
        */
        
        // For now, set empty arrays since we're removing mock data
        setUsers([]);
        setAppointments([]);
        setServices([]);
        setBlogPosts([]);
        setStats({
          totalUsers: 0,
          totalAppointments: 0,
          pendingAppointments: 0,
          revenue: 0,
          newUsersThisMonth: 0,
          completedAppointments: 0
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleAddUser = () => {
    openModal('addUser');
  };

  const handleEditUser = (user) => {
    openModal({ type: 'editUser', data: user });
  };

  const handleViewUser = (user) => {
    openModal({ type: 'viewUser', data: user });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleAddAppointment = () => {
    openModal('addAppointment');
  };

  const handleEditAppointment = (appointment) => {
    openModal({ type: 'editAppointment', data: appointment });
  };

  const handleViewAppointment = (appointment) => {
    openModal({ type: 'viewAppointment', data: appointment });
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
    }
  };

  const handleAddService = () => {
    openModal('addService');
  };

  const handleEditService = (service) => {
    openModal({ type: 'editService', data: service });
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const handleAddPost = () => {
    openModal('addPost');
  };

  const handleEditPost = (post) => {
    openModal({ type: 'editPost', data: post });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setBlogPosts(blogPosts.filter(post => post.id !== postId));
    }
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardOverview stats={stats} appointments={appointments} onViewAppointment={handleViewAppointment} />;
      case 'users':
        return <UserManagement 
          users={users} 
          onAddUser={handleAddUser} 
          onEditUser={handleEditUser} 
          onViewUser={handleViewUser} 
          onDeleteUser={handleDeleteUser}
          searchTerm={searchTerm}
        />;
      case 'appointments':
        return <AppointmentManagement 
          appointments={appointments} 
          onAddAppointment={handleAddAppointment} 
          onEditAppointment={handleEditAppointment} 
          onViewAppointment={handleViewAppointment} 
          onDeleteAppointment={handleDeleteAppointment}
          searchTerm={searchTerm}
        />;
      case 'services':
        return <ServiceManagement 
          services={services} 
          onAddService={handleAddService} 
          onEditService={handleEditService} 
          onDeleteService={handleDeleteService}
        />;
      case 'blog':
        return <BlogManagement 
          posts={blogPosts} 
          onAddPost={handleAddPost} 
          onEditPost={handleEditPost} 
          onDeletePost={handleDeletePost}
          searchTerm={searchTerm}
        />;
      default:
        return <DashboardOverview stats={stats} appointments={appointments} onViewAppointment={handleViewAppointment} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
      <div className="admin-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {renderSection()}
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
        <LiveChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
      {isModalOpen && (
        <Modal content={modalContent} onClose={closeModal} />
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

function DashboardOverview({ stats, appointments, onViewAppointment }) {
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
      </div>
      
      <div className="dashboard-content">
        <div className="recent-appointments">
          <h2>Recent Appointments</h2>
          {appointments.length > 0 ? (
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
                {appointments.slice(0, 5).map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patient}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date} at {appointment.time}</td>
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
          ) : (
            <div className="no-data">
              <p>No appointments found</p>
            </div>
          )}
        </div>
        
        <div className="quick-stats">
          <h2>Quick Actions</h2>
          <div className="quick-action-cards">
            <div className="quick-action-card">
              <FaUserPlus />
              <h3>Add New User</h3>
              <p>Create a new patient or doctor account</p>
            </div>
            <div className="quick-action-card">
              <FaCalendarAlt />
              <h3>Schedule Appointment</h3>
              <p>Book a new appointment for a patient</p>
            </div>
            <div className="quick-action-card">
              <FaFileExport />
              <h3>Generate Report</h3>
              <p>Export monthly statistics and data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement({ users, onAddUser, onEditUser, onViewUser, onDeleteUser, searchTerm }) {
  const [filter, setFilter] = useState('all');
  
  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="management-section">
      <div className="section-header">
        <h1>User Management</h1>
        <button className="add-btn" onClick={onAddUser}>
          <FaPlus /> Add User
        </button>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label>Filter by role:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Users</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => {}}
            disabled
          />
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                    {user.specialty && <div className="user-specialty">{user.specialty}</div>}
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => onViewUser(user)}
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => onEditUser(user)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        <FaTrash />
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
          <p>No users found</p>
        </div>
      )}
    </div>
  );
}

function AppointmentManagement({ appointments, onAddAppointment, onEditAppointment, onViewAppointment, onDeleteAppointment, searchTerm }) {
  const [filter, setFilter] = useState('all');
  
  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Appointment Management</h1>
        <button className="add-btn" onClick={onAddAppointment}>
          <FaPlus /> New Appointment
        </button>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search appointments..." 
            value={searchTerm}
            onChange={(e) => {}}
            disabled
          />
        </div>
      </div>
      
      {filteredAppointments.length > 0 ? (
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
                <tr key={appointment.id}>
                  <td>{appointment.patient}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.date} at {appointment.time}</td>
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
                      <button 
                        className="edit-btn"
                        onClick={() => onEditAppointment(appointment)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => onDeleteAppointment(appointment.id)}
                      >
                        <FaTrash />
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
          <p>No appointments found</p>
        </div>
      )}
    </div>
  );
}

function ServiceManagement({ services, onAddService, onEditService, onDeleteService }) {
  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Service Management</h1>
        <button className="add-btn" onClick={onAddService}>
          <FaPlus /> Add Service
        </button>
      </div>
      
      {services.length > 0 ? (
        <div className="cards-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className={`status-badge ${service.status}`}>
                  {service.status}
                </span>
              </div>
              <p className="service-description">{service.description}</p>
              <div className="service-details">
                <div className="service-price">৳{service.price}</div>
                <div className="service-duration">{service.duration}</div>
              </div>
              <div className="service-footer">
                <div className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => onEditService(service)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => onDeleteService(service.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-data">
          <p>No services found</p>
        </div>
      )}
    </div>
  );
}

function BlogManagement({ posts, onAddPost, onEditPost, onDeletePost, searchTerm }) {
  const [filter, setFilter] = useState('all');
  
  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="management-section">
      <div className="section-header">
        <h1>Blog Management</h1>
        <button className="add-btn" onClick={onAddPost}>
          <FaPlus /> New Post
        </button>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchTerm}
            onChange={(e) => {}}
            disabled
          />
        </div>
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.author}</td>
                  <td>{post.category}</td>
                  <td>{post.date}</td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.views}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn"><FaEye /></button>
                      <button 
                        className="edit-btn"
                        onClick={() => onEditPost(post)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => onDeletePost(post.id)}
                      >
                        <FaTrash />
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
          <p>No posts found</p>
        </div>
      )}
    </div>
  );
}

function Modal({ content, onClose }) {
  if (!content) return null;
  
  if (typeof content === 'string') {
    // Simple modal for add actions
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Add New {content.charAt(0).toUpperCase() + content.slice(1)}</h2>
            <button className="modal-close" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="modal-body">
            <p>This form would allow you to add a new {content}.</p>
            <p>In a real application, this would contain input fields and validation.</p>
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Detailed modal for view/edit actions
  const { type, data } = content;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{type.charAt(0).toUpperCase() + type.slice(1)}: {data.name || data.title || data.patient}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {type === 'viewUser' && (
            <div className="user-details-modal">
              <div className="detail-row">
                <label>Name:</label>
                <span>{data.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{data.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{data.phone}</span>
              </div>
              <div className="detail-row">
                <label>Role:</label>
                <span className={`role-badge ${data.role}`}>{data.role}</span>
              </div>
              {data.specialty && (
                <div className="detail-row">
                  <label>Specialty:</label>
                  <span>{data.specialty}</span>
                </div>
              )}
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${data.status}`}>{data.status}</span>
              </div>
              <div className="detail-row">
                <label>Join Date:</label>
                <span>{data.joinDate}</span>
              </div>
            </div>
          )}
          
          {type === 'viewAppointment' && (
            <div className="appointment-details-modal">
              <div className="detail-row">
                <label>Patient:</label>
                <span>{data.patient}</span>
              </div>
              <div className="detail-row">
                <label>Doctor:</label>
                <span>{data.doctor}</span>
              </div>
              <div className="detail-row">
                <label>Date:</label>
                <span>{data.date}</span>
              </div>
              <div className="detail-row">
                <label>Time:</label>
                <span>{data.time}</span>
              </div>
              <div className="detail-row">
                <label>Service:</label>
                <span>{data.service}</span>
              </div>
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge ${data.status}`}>{data.status}</span>
              </div>
              <div className="detail-row">
                <label>Notes:</label>
                <span>{data.notes}</span>
              </div>
            </div>
          )}
          
          {(type === 'editUser' || type === 'editAppointment' || type === 'editService' || type === 'editPost') && (
            <div className="edit-form">
              <p>This form would allow you to edit the {type.replace('edit', '')} details.</p>
              <p>In a real application, this would contain pre-filled input fields based on the data.</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          {type.startsWith('edit') && (
            <button className="btn-primary">Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}