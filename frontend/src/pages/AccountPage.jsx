import { useState, useEffect } from 'react'
import { apiRequest } from '../lib/api'

function AccountPage({
  t,
  auth,
  registerForm,
  setRegisterForm,
  loginForm,
  setLoginForm,
  onRegister,
  onLogin,
  onLogout,
}) {
  const [isLoginView, setIsLoginView] = useState(true)
  const [profile, setProfile] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    profilePicUrl: ''
  })
  const [profileMessage, setProfileMessage] = useState('')

  useEffect(() => {
    if (auth.token) {
      loadProfile()
    }
  }, [auth.token])

  async function loadProfile() {
    try {
      const data = await apiRequest('/api/users/me', { token: auth.token })
      setProfile(data)
      setProfileForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        profilePicUrl: data.profilePicUrl || ''
      })
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    try {
      const updated = await apiRequest('/api/users/me', {
        method: 'PUT',
        token: auth.token,
        body: profileForm
      })
      setProfile(updated)
      setIsEditingProfile(false)
      setProfileMessage('Profile updated successfully!')
      setTimeout(() => setProfileMessage(''), 3000)
    } catch (err) {
      setProfileMessage(err.message || 'Error updating profile')
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, profilePicUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  if (auth.token) {
    return (
      <section className="section-block">
        <div className="account-dashboard panel" style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{profile?.firstName ? `${profile.firstName}'s Profile` : t.accountAccess}</h2>
            <button type="button" onClick={onLogout} className="ghost" style={{ padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
              {t.logout}
            </button>
          </div>

          {profileMessage && <p className="alert success">{profileMessage}</p>}

          <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="form-grid">
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profileForm.profilePicUrl ? 
                        <img src={profileForm.profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                        <span style={{ fontSize: '2rem' }}>👤</span>}
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Update Photo (Upload Icon/Picture)</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>
                  
                  <div className="inline-fields">
                    <input type="text" placeholder="First Name" value={profileForm.firstName} onChange={e => setProfileForm(s => ({ ...s, firstName: e.target.value }))} />
                    <input type="text" placeholder="Last Name" value={profileForm.lastName} onChange={e => setProfileForm(s => ({ ...s, lastName: e.target.value }))} />
                  </div>
                  <input type="tel" placeholder="Phone Number" value={profileForm.phoneNumber} onChange={e => setProfileForm(s => ({ ...s, phoneNumber: e.target.value }))} />
                  <textarea placeholder="Shipping Address" value={profileForm.address} onChange={e => setProfileForm(s => ({ ...s, address: e.target.value }))}></textarea>
                  
                  <div className="inline-fields" style={{ marginTop: '1rem' }}>
                    <button type="submit" className="primary-btn">Save Changes</button>
                    <button type="button" className="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profile?.profilePicUrl ? 
                        <img src={profile.profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                        <span style={{ fontSize: '3rem' }}>👤</span>}
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>{profile?.firstName} {profile?.lastName}</h3>
                      <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0' }}>{auth.email}</p>
                      <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', backgroundColor: 'var(--accent)', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{auth.role}</span>
                    </div>
                  </div>
                  
                  <div className="account-details" style={{ fontSize: '1.1rem', backgroundColor: 'var(--surface2)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> {profile?.phoneNumber || 'Not set'}</p>
                    <p style={{ margin: '0.5rem 0' }}><strong>Address:</strong> {profile?.address || 'Not set'}</p>
                  </div>
                  
                  <button type="button" onClick={() => setIsEditingProfile(true)} className="ghost" style={{ marginTop: '1.5rem', width: '100%' }}>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-block">
      <div className="auth-container">
        <div className="auth-box panel">
          <div className="auth-tabs">
            <button 
              type="button" 
              className={`auth-tab ${isLoginView ? 'active' : ''}`}
              onClick={() => setIsLoginView(true)}
            >
              {t.login}
            </button>
            <button 
              type="button" 
              className={`auth-tab ${!isLoginView ? 'active' : ''}`}
              onClick={() => setIsLoginView(false)}
            >
              {t.register}
            </button>
          </div>

          <div className="auth-content">
            {isLoginView ? (
              <form onSubmit={onLogin} className="form-grid">
                <h3>Welcome Back</h3>
                <p className="auth-subtitle">Log in to your account to continue</p>
                <input
                  type="email"
                  required
                  placeholder={t.email}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="password"
                  required
                  placeholder={t.password}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
                />
                <button type="submit" className="primary-btn">{t.login}</button>
              </form>
            ) : (
              <form onSubmit={onRegister} className="form-grid">
                <h3>Create Account</h3>
                <p className="auth-subtitle">Join AR - DECKDROP for exclusive deals</p>
                <div className="inline-fields">
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={registerForm.firstName}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, firstName: e.target.value }))}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm((s) => ({ ...s, lastName: e.target.value }))}
                  />
                </div>
                <input
                  type="email"
                  required
                  placeholder={t.email}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="tel"
                  required
                  pattern="[+0-9 -]+"
                  placeholder="Phone Number (e.g. +49 123 456789)"
                  value={registerForm.phoneNumber}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, phoneNumber: e.target.value }))}
                />
                <input
                  type="text"
                  required
                  placeholder="Shipping Address"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, address: e.target.value }))}
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder={t.password}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))}
                />
                <button type="submit" className="primary-btn">{t.register}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AccountPage
