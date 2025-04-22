'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container,
  Button,
  Card,
  ListGroup,
  Modal,
  Badge,
  Stack,
  Alert,
  Form
} from 'react-bootstrap';
import axios from 'axios'
import { URL } from '@/constants';
import { Category, NavigationItem } from '@/types';

// Adjust this to match your backend URL
const API_BASE_URL = 'http://localhost:3000/api'; // Change to your backend URL

const ManageCategories = () => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Category, '_id' | 'createdAt' | 'updatedAt'>>({
    slug: '',
    canonicalName: '',
    axis: 'occasion',
    attributes: {},
    validFrom: '',
    validUntil: ''
  });
  const [navFormData, setNavFormData] = useState({
    label: '',
    icon: '',
    parentId: null as string | null,
    sortOrder: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, navigationRes] = await Promise.all([
        axios.get(`${URL}/categories`),
        axios.get(`${URL}/navigation`)
      ]);
      
      setCategories(categoriesRes.data);
      setNavigation(navigationRes.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await axios.put(`${API_BASE_URL}/categories/${selectedCategory._id}`, formData);
      } else {
        await axios.post(`${URL}/categories`, formData);
      }
      setShowCategoryModal(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${URL}/categories/${id}`);
        await loadData();
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  // Navigation handlers
  const handleSubmitNavigation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedCategory) return;
      
      const payload = {
        targetType: 'category',
        category: selectedCategory._id,
        label: navFormData.label,
        icon: navFormData.icon,
        parentId: navFormData.parentId,
        sortOrder: navFormData.sortOrder
      };

      await axios.post(`${URL}/navigation`, payload);
      setShowNavModal(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      console.log(error)
    }
  };

  // Helper function to flatten navigation with proper typing
  const flattenNavigation = (items: NavigationItem[], depth = 0): Array<NavigationItem & { depth: number }> => {
    return items.reduce<Array<NavigationItem & { depth: number }>>((acc, item) => {
      acc.push({ ...item, depth });
      if (item.children) {
        acc.push(...flattenNavigation(item.children, depth + 1));
      }
      return acc;
    }, []);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Category Management</h1>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Stack direction="horizontal" className="mb-4 justify-content-between">
        <Button 
          variant="primary"
          onClick={() => {
            setSelectedCategory(null);
            setFormData({
              slug: '',
              canonicalName: '',
              axis: 'occasion',
              attributes: {},
              validFrom: '',
              validUntil: ''
            });
            setShowCategoryModal(true);
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Create Category'}
        </Button>
      </Stack>

      {/* Categories List */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Categories</h5>
          <Badge bg="secondary" pill>{categories.length} items</Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-4">Loading categories...</div>
          ) : (
            <ListGroup variant="flush">
              {categories.map(category => (
                <ListGroup.Item key={category._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{category.canonicalName}</h6>
                      <small className="text-muted">
                        /{category.slug} • {category.axis}
                        {category.validFrom && ` • ${new Date(category.validFrom).toLocaleDateString()}`}
                      </small>
                    </div>
                    <Stack direction="horizontal" gap={2}>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setFormData({
                            slug: category.slug,
                            canonicalName: category.canonicalName,
                            axis: category.axis,
                            attributes: category.attributes || {},
                            validFrom: category.validFrom?.toString().split('T')[0] || '',
                            validUntil: category.validUntil?.toString().split('T')[0] || ''
                          });
                          setShowCategoryModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          setNavFormData({
                            label: category.canonicalName,
                            icon: category.attributes?.icon || '',
                            parentId: null,
                            sortOrder: 0
                          });
                          setShowNavModal(true);
                        }}
                      >
                        Add to Nav
                      </Button>
                    </Stack>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCategory ? 'Edit Category' : 'Create Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitCategory}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                //required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.canonicalName}
                onChange={(e) => setFormData({...formData, canonicalName: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category Type</Form.Label>
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {['occasion', 'product-type', 'season', 'theme'].map((type) => (
                  <Button
                    key={type}
                    variant={formData.axis === type ? 'primary' : 'outline-secondary'}
                    onClick={() => setFormData({...formData, axis: type as Category['axis']})}
                    type="button"
                  >
                    {type}
                  </Button>
                ))}
              </Stack>
            </Form.Group>

            <Stack direction="horizontal" gap={3}>
              <Form.Group className="flex-grow-1">
                <Form.Label>Valid From</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="flex-grow-1">
                <Form.Label>Valid Until</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                />
              </Form.Group>
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Processing...' : (selectedCategory ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Navigation Modal */}
      <Modal show={showNavModal} onHide={() => setShowNavModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Navigation</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitNavigation}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Navigation Label</Form.Label>
              <Form.Control
                type="text"
                value={navFormData.label}
                onChange={(e) => setNavFormData({...navFormData, label: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Icon (optional)</Form.Label>
              <Form.Control
                type="text"
                value={navFormData.icon}
                onChange={(e) => setNavFormData({...navFormData, icon: e.target.value})}
                placeholder="emoji or icon name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Parent Menu Item</Form.Label>
              <Form.Select
                value={navFormData.parentId || ''}
                onChange={(e) => setNavFormData({...navFormData, parentId: e.target.value || null})}
              >
                <option value="">(Top Level)</option>
                {flattenNavigation(navigation).map(item => (
                  <option key={item._id} value={item._id}>
                    {'→ '.repeat(item.depth || 0)} {item.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sort Order</Form.Label>
              <Form.Control
                type="number"
                value={navFormData.sortOrder}
                onChange={(e) => setNavFormData({...navFormData, sortOrder: parseInt(e.target.value) || 0})}
                min="0"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNavModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Add to Navigation'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ManageCategories;