import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Loading, ProductSkeleton } from '../components/Loading';
import EmptyState from '../components/EmptyState';
import './Products.css';
import { API_BASE_URL } from '../config';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const page = searchParams.get('page') || 1;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/products?page=${page}&limit=12`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories/all`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryFilter = (cat) => {
    setSearchParams({
      category: cat === category ? '' : cat,
      page: '1'
    });
  };

  const handlePageChange = (newPage) => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    params.page = newPage;
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  return (
    <div className="products-page">
      <Navbar />

      <section className="section">
        <div className="container">
          <h1 className="page-title">Our Products</h1>

          <div className="products-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar hide-mobile">
              <div className="filter-group">
                <h4 className="filter-title">Categories</h4>
                <div className="filter-options">
                  <button
                    className={`filter-option ${!category ? 'active' : ''}`}
                    onClick={() => handleCategoryFilter('')}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-option ${category === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="products-main">
              {loading ? (
                <div className="grid grid-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-4">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={page === 1}
                        onClick={() => handlePageChange(parseInt(page) - 1)}
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(parseInt(page) + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  title="No products found"
                  description={
                    search || category
                      ? `No products match your filters. Try adjusting your search.`
                      : "No products available yet."
                  }
                  action="/products"
                />
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
