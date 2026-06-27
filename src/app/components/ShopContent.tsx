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
  Pagination,
  PaginationItem,
  PaginationLink,
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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

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
      try {
        const params: any = { page: 1, limit: 12 };
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
        const res = await getProducts({ params });
        if (res.data && res.data.success) {
          setProductList(res.data.data.records || []);
        }
      } catch (error) {
        console.error("Error fetching products in ShopContent:", error);
      }
    };
    fetchProducts();
  }, [categoryId, selectedSize, selectedColor, debouncedValue]);

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
                    <DropdownToggle caret>Latest</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Latest</DropdownItem>
                      <DropdownItem>Popular</DropdownItem>
                      <DropdownItem>Most Purchased</DropdownItem>
                      <DropdownItem>Most Rated</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown isOpen={dropdownOpen2} toggle={toggle2}>
                    <DropdownToggle caret>Filter By</DropdownToggle>
                    <DropdownMenu>
                      {/* <DropdownItem header>Header</DropdownItem> */}
                      <DropdownItem>Relevance</DropdownItem>
                      <DropdownItem>Name, A to Z</DropdownItem>
                      <DropdownItem>Name, Z to A</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Price, low to high</DropdownItem>
                      <DropdownItem>Price, high to low</DropdownItem>
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
              <div className="d-flex justify-content-center mt-5">
                <Pagination size="">
                  <PaginationItem>
                    <PaginationLink first href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" previous />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">5</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" next />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" last />
                  </PaginationItem>
                </Pagination>
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
