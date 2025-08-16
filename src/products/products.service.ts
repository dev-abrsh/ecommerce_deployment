import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.model';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @Inject('CLOUDINARY') private readonly cloudinary: any,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    imageUrl: string,
  ): Promise<Product> {
    const product = new this.productModel({
      ...createProductDto,
      image_url: imageUrl,
    });
    return await product.save();
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productModel
      .find()
      .populate('category_id')
      .populate('brand_id');
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category_id')
      .populate('brand_id');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(
    id: string,
    updateDto: UpdateProductDto,
  ): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, updateDto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Product not found');
  }
  /**
   * Upload an image from Multer memory buffer to Cloudinary via upload_stream.
   * Returns the secure_url string.
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer || !file.mimetype) {
      throw new BadRequestException('Invalid image file');
    }

    const publicIdBase = this.slugBase(file.originalname);

    const secureUrl = await new Promise<string>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'products',
          resource_type: 'image',
          public_id: `${publicIdBase}-${Date.now()}`,
          overwrite: false,
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new BadRequestException(error.message));
          resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(stream);
    });

    return secureUrl;
  }

  private slugBase(filename: string): string {
    const noExt = filename.replace(/\.[^/.]+$/, '');
    return noExt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
