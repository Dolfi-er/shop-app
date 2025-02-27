import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const productsFilePath = path.join(__dirname, 'products.json');

// Получить все товары
app.get('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить товар по ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const { products } = JSON.parse(data);
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить новый товар
app.post('/api/products', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const newProduct = req.body;
    
    // Проверка обязательных полей
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.categories) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }
    
    // Генерация ID для нового товара
    newProduct.id = String(Date.now());
    
    jsonData.products.push(newProduct);
    
    await fs.writeFile(productsFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить несколько товаров
app.post('/api/products/batch', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const newProducts = req.body;
    
    if (!Array.isArray(newProducts)) {
      return res.status(400).json({ error: 'Ожидается массив товаров' });
    }
    
    // Проверка и добавление ID для каждого товара
    const productsToAdd = newProducts.map((product, index) => {
      if (!product.name || !product.price || !product.description || !product.categories) {
        throw new Error(`Товар #${index} содержит не все обязательные поля`);
      }
      
      return {
        ...product,
        id: String(Date.now() + index)
      };
    });
    
    jsonData.products = [...jsonData.products, ...productsToAdd];
    
    await fs.writeFile(productsFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    res.status(201).json(productsToAdd);
  } catch (error) {
    console.error('Ошибка при добавлении товаров:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить товар по ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const productIndex = jsonData.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const updatedProduct = {
      ...jsonData.products[productIndex],
      ...req.body,
      id: req.params.id // Сохраняем исходный ID
    };
    
    jsonData.products[productIndex] = updatedProduct;
    
    await fs.writeFile(productsFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Ошибка при обновлении товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить товар по ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    const productIndex = jsonData.products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Товар не найден' });
    }
    
    const deletedProduct = jsonData.products[productIndex];
    jsonData.products.splice(productIndex, 1);
    
    await fs.writeFile(productsFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    
    res.json(deletedProduct);
  } catch (error) {
    console.error('Ошибка при удалении товара:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить все категории
app.get('/api/categories', async (req, res) => {
  try {
    const data = await fs.readFile(productsFilePath, 'utf8');
    const { categories } = JSON.parse(data);
    res.json(categories);
  } catch (error) {
    console.error('Ошибка при чтении файла:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер панели администратора запущен на порту ${PORT}`);
});

// Для тестирования
console.log('Сервер панели администратора запущен на порту', PORT);