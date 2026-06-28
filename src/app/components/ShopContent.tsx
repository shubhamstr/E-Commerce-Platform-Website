/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row
} from 'reactstrap';
import ProductCard from './ProductCard';
import Slider from '@mui/material/Slider';
import styles from './shop.module.css';
import { getProducts } from '../../services/productService';
import { getAllCategories } from '../../services/categoryService';
import { useSearchParams, useRouter } from 'next/navigation';

const ShopContent = () => {
  const [productList, setProductList] = useState<any>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [value, setValue] = React.useState<number[]>([0, 500]);
  const [debouncedValue, setDebouncedValue] = useState<number[]>([0, 500]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('latest');
  const observerRef = React.useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
  };

  const toggle1 = () => setDropdownOpen1((prevState) => !prevState);
  const toggle2 = () => setDropdownOpen2((prevState) => !prevState);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories({
          params: { page: 1, limit: 100 }
        });
        if (res.data && res.data.success) {
          setCategories(res.data.data.records || []);
        }
      } catch (error) {
        console.error("Error fetching categories in ShopContent:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingMore(true);
      try {
        const params: any = { page, limit: 12 };
        const filtersObj: any = {};
        if (categoryId) {
          filtersObj.categoryId = { value: categoryId };
        }
        if (selectedSize) {
          filtersObj.sizes = { value: selectedSize };
        }
        if (selectedColor) {
          filtersObj.colors = { value: selectedColor };
        }
        if (debouncedValue) {
          filtersObj.price = { value: debouncedValue };
        }
        if (Object.keys(filtersObj).length > 0) {
          params.filters = JSON.stringify(filtersObj);
        }

        // Sorting mapping
        if (sortBy === 'latest') {
          params.sortField = 'createdAt';
          params.sortOrder = -1;
        } else if (sortBy === 'popular') {
          params.sortField = 'popular';
          params.sortOrder = -1;
        } else if (sortBy === 'most_purchased') {
          params.sortField = 'most_purchased';
          params.sortOrder = -1;
        } else if (sortBy === 'most_rated') {
          params.sortField = 'most_rated';
          params.sortOrder = -1;
        } else if (sortBy === 'relevance') {
          params.sortField = 'createdAt';
          params.sortOrder = -1;
        } else if (sortBy === 'name_asc') {
          params.sortField = 'name';
          params.sortOrder = 1;
        } else if (sortBy === 'name_desc') {
          params.sortField = 'name';
          params.sortOrder = -1;
        } else if (sortBy === 'price_asc') {
          params.sortField = 'price';
          params.sortOrder = 1;
        } else if (sortBy === 'price_desc') {
          params.sortField = 'price';
          params.sortOrder = -1;
        }

        const res = await getProducts({ params });
        if (res.data && res.data.success) {
          const records = res.data.data.records || [];
          const total = res.data.data.total || 0;

          if (page === 1) {
            setProductList(records);
          } else {
            setProductList((prev: any) => [...prev, ...records]);
          }

          if (records.length < 12 || (page * 12) >= total) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
        }
      } catch (error) {
        console.error("Error fetching products in ShopContent:", error);
      } finally {
        setLoadingMore(false);
      }
    };
    fetchProducts();
  }, [categoryId, selectedSize, selectedColor, debouncedValue, sortBy, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [categoryId, selectedSize, selectedColor, debouncedValue, sortBy]);

  // Scroll observer logic
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const currentRef = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore]);

  return (
    <Container fluid="sm">
      <Row xs="1" sm="2" className="py-3">
        <Col xs="12" sm="12" md="8">
          <Row xs="1" sm="2" className="py-3">
            <Col xs="12" sm="12" md="12">
              <div className="d-flex justify-content-between">
                <h4>Shop All</h4>
                <div className="d-flex gap-2">
                  <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                    <DropdownToggle caret>
                      {sortBy === 'latest' ? 'Latest' :
                       sortBy === 'popular' ? 'Popular' :
                       sortBy === 'most_purchased' ? 'Most Purchased' :
                       sortBy === 'most_rated' ? 'Most Rated' : 'Sort By'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setSortBy('latest')}>Latest</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('popular')}>Popular</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('most_purchased')}>Most Purchased</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('most_rated')}>Most Rated</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={dropdownOpen2} toggle={toggle2}>
                    <DropdownToggle caret>
                      {sortBy === 'relevance' ? 'Relevance' :
                       sortBy === 'name_asc' ? 'Name, A to Z' :
                       sortBy === 'name_desc' ? 'Name, Z to A' :
                       sortBy === 'price_asc' ? 'Price, low to high' :
                       sortBy === 'price_desc' ? 'Price, high to low' : 'Filter By'}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setSortBy('relevance')}>Relevance</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('name_asc')}>Name, A to Z</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('name_desc')}>Name, Z to A</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem onClick={() => setSortBy('price_asc')}>Price, low to high</DropdownItem>
                      <DropdownItem onClick={() => setSortBy('price_desc')}>Price, high to low</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="12" md="12">
              <div className="d-flex flex-wrap gap-5 justify-content-start mt-3">
                {productList.map((product: any, index: any) => {
                  return <ProductCard key={index} index={index} product={product} screen="shop" />;
                })}
              </div>
            </Col>
            <Col xs="12" sm="12" md="12">
              <div ref={observerRef} className="text-center py-4 mt-3">
                {loadingMore && (
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                {!hasMore && productList.length > 0 && (
                  <p className="text-muted small">No more products to show.</p>
                )}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs="12" sm="12" md="4">
          <div className={styles.stickySidebar}>
            <Card
              style={{
                width: '18rem'
              }}
            >
              <CardBody>
                <CardTitle tag="h6" className="fs-6 fw-medium text-uppercase mb-3">
                  Categories
                </CardTitle>
                <ul className={styles.listStyle}>
                  <li
                    className={`py-1 d-flex justify-content-between ${!categoryId ? 'text-black fw-bold' : 'text-primary'
                      } ${styles.pointer}`}
                    onClick={() => router.push('/shop')}
                  >
                    <p className="m-0">All Categories</p>
                  </li>
                  {categories.map((category: any) => {
                    const isActive = categoryId === String(category.id);
                    return (
                      <li
                        key={category.id}
                        className={`py-1 d-flex justify-content-between ${isActive ? 'text-black fw-bold' : 'text-primary'
                          } ${styles.pointer}`}
                        onClick={() => router.push(`/shop?category=${category.id}`)}
                      >
                        <p className="m-0">{category.name}</p>
                        <span>({category.productCount || 0})</span>
                      </li>
                    )
                  })}
                </ul>
              </CardBody>
            </Card>
            <Card
              style={{
                width: '18rem'
              }}
              className="mt-3"
            >
              <CardBody>
                <CardTitle tag="h6" className="fs-6 fw-medium text-uppercase mb-3">
                  Filter by Price
                </CardTitle>
                <div className="">
                  <Slider value={value} step={10} min={0} max={500} onChange={handleChange} valueLabelDisplay="auto" />
                  <p>
                    ${value[0]} - ${value[1]}
                  </p>
                </div>
                <CardTitle tag="h6" className="fs-6 fw-medium text-uppercase mb-3 mt-5">
                  Size
                </CardTitle>
                <ul className={styles.listStyle}>
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <li key={size} className="py-1">
                      <Input
                        type="checkbox"
                        id={`size-${size}`}
                        className="me-2"
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(selectedSize === size ? null : size)}
                      />
                      <Label
                        className={`${styles.pointer} user-select-none ${selectedSize === size ? 'fw-bold text-black' : 'text-primary'}`}
                        check
                        for={`size-${size}`}
                      >
                        {size === 'S' ? 'Small (S)' : size === 'M' ? 'Medium (M)' : size === 'L' ? 'Large (L)' : 'Extra Large (XL)'}
                      </Label>
                    </li>
                  ))}
                </ul>
                <CardTitle tag="h6" className="fs-6 fw-medium text-uppercase mb-3 mt-5">
                  Color
                </CardTitle>
                <ul className={styles.listStyle}>
                  {[
                    { name: 'Red', class: 'bg-danger' },
                    { name: 'Green', class: 'bg-success' },
                    { name: 'Blue', class: 'bg-info' },
                    { name: 'Purple', class: 'bg-primary' },
                    { name: 'Black', class: 'bg-dark' },
                    { name: 'White', class: 'bg-light border' }
                  ].map((color) => (
                    <li
                      key={color.name}
                      className={`py-1 d-flex justify-content-between ${selectedColor === color.name ? 'text-black fw-bold' : 'text-primary'} ${styles.pointer}`}
                      onClick={() => setSelectedColor(selectedColor === color.name ? null : color.name)}
                    >
                      <p className="m-0 d-flex align-items-center">
                        <span className={`${color.class} color d-inline-block rounded-circle me-2 ${styles.colorTag}`}></span>
                        <span>{color.name}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ShopContent;
