import { useState, useEffect } from 'react'
import { apiRequest } from '../lib/api'

function AdminPage({ t, isAdmin, auth, onProductsReload }) {
  const [activeTab, setActiveTab] = useState('products')

  // Data
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Product Form state
  const [editingProductId, setEditingProductId] = useState(null)
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', currency: 'EUR', 
    preorder: false, releaseDate: '', stockQuantity: '', 
    categoryId: '', subcategoryId: '', images: []
  })

  // Category Form state
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' })
  
  // Subcategory Form state
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null)
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', description: '', categoryId: '' })

  const API_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

  useEffect(() => {
    if (isAdmin) {
      loadData()
    }
  }, [isAdmin])

  async function loadData() {
    setCategories(await window.fetch(API_URL + '/api/categories').then(r => r.json()))
    setProducts(await window.fetch(API_URL + '/api/products').then(r => r.json()))
  }

  // --- Handlers for Products ---
  async function saveProduct(e) {
    e.preventDefault()
    try {
      const p = { ...productForm, categoryId: productForm.categoryId || null, subcategoryId: productForm.subcategoryId || null }
      const method = editingProductId ? 'PUT' : 'POST'
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products'
      await apiRequest(url, { method, body: p, token: auth.token })
      setSuccess('Product saved!')
      setEditingProductId(null)
      loadData()
      if (onProductsReload) onProductsReload()
    } catch (err) { setError(err.message) }
  }

  async function deleteProduct(id) {
    try {
      await apiRequest(`/api/products/${id}`, { method: 'DELETE', token: auth.token })
      setSuccess('Product deleted!')
      loadData()
      if (onProductsReload) onProductsReload()
    } catch (err) { setError(err.message) }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(s => ({ ...s, images: [...s.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  }

  // --- Handlers for Categories ---
  async function saveCategory(e) {
    e.preventDefault()
    try {
      const method = editingCategoryId ? 'PUT' : 'POST'
      const url = editingCategoryId ? `/api/categories/${editingCategoryId}` : '/api/categories'
      await apiRequest(url, { method, body: categoryForm, token: auth.token })
      setSuccess('Category saved!')
      setEditingCategoryId(null)
      loadData()
    } catch (err) { setError(err.message) }
  }

  async function deleteCategory(id) {
    try {
      await apiRequest(`/api/categories/${id}`, { method: 'DELETE', token: auth.token })
      setSuccess('Category deleted!')
      loadData()
    } catch (err) { setError(err.message) }
  }

  async function saveSubcategory(e) {
    e.preventDefault()
    try {
      const method = editingSubcategoryId ? 'PUT' : 'POST'
      const url = editingSubcategoryId 
        ? `/api/categories/subcategories/${editingSubcategoryId}` 
        : `/api/categories/${subcategoryForm.categoryId}/subcategories`
      await apiRequest(url, { method, body: subcategoryForm, token: auth.token })
      setSuccess('Subcategory saved!')
      setEditingSubcategoryId(null)
      loadData()
    } catch (err) { setError(err.message) }
  }

  async function deleteSubcategory(id) {
    try {
      await apiRequest(`/api/categories/subcategories/${id}`, { method: 'DELETE', token: auth.token })
      setSuccess('Subcategory deleted!')
      loadData()
    } catch (err) { setError(err.message) }
  }

  if (!isAdmin) {
    return (
      <section className="section-block utility-grid" style={{ placeContent: 'center', textAlign: 'center' }}>
        <article className="panel"><h2>Access Denied</h2><p>You must be an admin to view this page.</p></article>
      </section>
    )
  }

  return (
    <section className="section-block">
      <div className="section-head" style={{ marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        {error && <p className="alert error">{error}</p>}
        {success && <p className="alert success">{success}</p>}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={activeTab === 'products' ? 'cta' : 'ghost'} onClick={() => setActiveTab('products')}>Products</button>
          <button className={activeTab === 'categories' ? 'cta' : 'ghost'} onClick={() => setActiveTab('categories')}>Categories & Subcategories</button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="utility-grid">
          <article className="panel">
            <h3>{editingProductId ? 'Edit Product' : 'Create Product'}</h3>
            <form onSubmit={saveProduct} className="form-grid">
              <input type="text" placeholder="Name" required value={productForm.name} onChange={e => setProductForm(s => ({ ...s, name: e.target.value }))} />
              <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm(s => ({ ...s, description: e.target.value }))} />
              
              <div className="inline-fields">
                <input type="number" required min="0" step="0.01" placeholder="Price" value={productForm.price} onChange={e => setProductForm(s => ({ ...s, price: e.target.value }))} />
                <input type="number" required min="0" placeholder="Qty" value={productForm.stockQuantity} onChange={e => setProductForm(s => ({ ...s, stockQuantity: e.target.value }))} />
              </div>

              <div className="inline-fields">
                <select value={productForm.categoryId} onChange={e => setProductForm(s => ({ ...s, categoryId: e.target.value, subcategoryId: '' }))}>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={productForm.subcategoryId} onChange={e => setProductForm(s => ({ ...s, subcategoryId: e.target.value }))}>
                  <option value="">-- Select Subcategory --</option>
                  {categories.find(c => c.id == productForm.categoryId)?.subcategories?.map(s => 
                     <option key={s.id} value={s.id}>{s.name}</option>
                  )}
                </select>
              </div>

              <div>
                <label>Images (Multiple allowed)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                <div style={{ display:'flex', gap:'5px', marginTop:'10px' }}>
                  {productForm.images.map((img, i) => (
                     <img key={i} src={img} alt="Product img" width="50" height="50" style={{objectFit:'cover', borderRadius:'4px'}} />
                  ))}
                  {productForm.images.length > 0 && <button type="button" onClick={() => setProductForm(s=>({ ...s, images: []}))} className="ghost" style={{fontSize:'12px'}}>Clear all</button>}
                </div>
              </div>
              
              <button type="submit">{editingProductId ? 'Update Product' : 'Create Product'}</button>
              {editingProductId && <button type="button" onClick={() => setEditingProductId(null)} className="ghost">Cancel</button>}
            </form>
          </article>
          
          <article className="panel" style={{ gridColumn: 'span 2' }}>
            <h3>Manage Products ({products.length})</h3>
            <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
              <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding: '0.5rem 0' }}>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.stockQuantity}</td>
                    <td>
                      <button className="ghost" aria-label="Edit product" onClick={() => {
                        setEditingProductId(p.id); 
                        setProductForm({
                          name: p.name, description: p.description||'', price: p.price, currency: p.currency, 
                          preorder: p.preorder, releaseDate: p.releaseDate||'', stockQuantity: p.stockQuantity, 
                          categoryId: p.category?.id || '', subcategoryId: p.subcategory?.id || '', images: p.images || []
                        });
                      }}>Edit</button>
                      <button className="ghost" style={{color: 'red'}} aria-label="Delete product" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="utility-grid">
          
          {/* CATEGORY BLOCK */}
          <article className="panel">
            <h3>{editingCategoryId ? 'Edit Category' : 'Create Category'}</h3>
            <form onSubmit={saveCategory} className="form-grid">
              <input type="text" placeholder="Category Name" required value={categoryForm.name} onChange={e => setCategoryForm(s => ({ ...s, name: e.target.value }))} />
              <textarea placeholder="Description" value={categoryForm.description} onChange={e => setCategoryForm(s => ({ ...s, description: e.target.value }))} />
              <button type="submit">{editingCategoryId ? 'Update' : 'Create'}</button>
              {editingCategoryId && <button type="button" onClick={() => {setEditingCategoryId(null); setCategoryForm({name:'',description:''})}} className="ghost">Cancel</button>}
            </form>

            <h3 style={{marginTop:'2rem'}}>Existing Categories</h3>
            <ul>
              {categories.map(c => (
                <li key={c.id} style={{marginBottom:'0.5rem', display:'flex', justifyContent:'space-between'}}>
                  <strong>{c.name}</strong>
                  <div>
                    <button className="ghost" style={{padding:'0.2rem 0.5rem', fontSize:'0.8rem'}} onClick={() => { setEditingCategoryId(c.id); setCategoryForm({name:c.name, description:c.description||''}); }}>Edit</button>
                    <button className="ghost" style={{color:'red', padding:'0.2rem 0.5rem', fontSize:'0.8rem'}} onClick={() => deleteCategory(c.id)}>Del</button>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          {/* SUBCATEGORY BLOCK */}
          <article className="panel">
            <h3>{editingSubcategoryId ? 'Edit Subcategory' : 'Create Subcategory'}</h3>
            <form onSubmit={saveSubcategory} className="form-grid">
              <select required disabled={editingSubcategoryId} value={subcategoryForm.categoryId} onChange={e => setSubcategoryForm(s => ({...s, categoryId: e.target.value}))}>
                <option value="">-- Select Parent Category --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Subcategory Name" required value={subcategoryForm.name} onChange={e => setSubcategoryForm(s => ({ ...s, name: e.target.value }))} />
              <textarea placeholder="Description" value={subcategoryForm.description} onChange={e => setSubcategoryForm(s => ({ ...s, description: e.target.value }))} />
              <button type="submit">{editingSubcategoryId ? 'Update' : 'Create'}</button>
              {editingSubcategoryId && <button type="button" onClick={() => {setEditingSubcategoryId(null); setSubcategoryForm({name:'',description:'', categoryId:''})}} className="ghost">Cancel</button>}
            </form>

            <h3 style={{marginTop:'2rem'}}>Existing Subcategories</h3>
            <ul>
              {categories.flatMap(c => (c.subcategories || []).map(s => ({...s, parentName: c.name}))).map(s => (
                <li key={s.id} style={{marginBottom:'0.5rem', display:'flex', justifyContent:'space-between'}}>
                  <span>[{s.parentName}] {s.name}</span>
                  <div>
                    <button className="ghost" style={{padding:'0.2rem 0.5rem', fontSize:'0.8rem'}} onClick={() => { setEditingSubcategoryId(s.id); setSubcategoryForm({name:s.name, description:s.description||'', categoryId: s.parentName}); }}>Edit</button>
                    <button className="ghost" style={{color:'red', padding:'0.2rem 0.5rem', fontSize:'0.8rem'}} onClick={() => deleteSubcategory(s.id)}>Del</button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}
    </section>
  )
}

export default AdminPage