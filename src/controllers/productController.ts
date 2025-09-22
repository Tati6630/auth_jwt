import { prismaClient } from "../../prisma/prisma.ts";
import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Request, Response } from "express";

enum productColumns {
    NAME = "name",
    DESCRIPTION = "description",
    PRICE = "price",
    STOCK = "stock",
}


export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const product = await prismaClient.product.create({
      data: {
        name,
        description,
        price,
        stock,
        userId,                           // associa produto ao admin
      },
    });

    return res.status(201).json({
        message: "Produto cadastrado com sucesso!",
        data: product,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send(`Erro no servidor: ${error}`);
  }
};


export const listProduct = async  (_:Request, res:Response) => {
    try {
        const product = await prismaClient.product.findMany();
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
};

export const listProductById = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;

        const product = await prismaClient.product.findUnique({
            where: {
                id: Number(id),
            }
        });

        if (!product) {
            return res.status(404).json({
                message: "Produto não existe no banco de dados."
            })
        }

        return res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
};

export const updateProductById = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const bodyKeys:string[] = Object.keys(body)
        for (const key of bodyKeys) {
            if (
                key !== productColumns.NAME && 
                key !== productColumns.DESCRIPTION && 
                key !== productColumns.PRICE &&
                key !== productColumns.STOCK
               ) 
                return res.status(404).send("Colunas não existentes");
        }
        const updated = await prismaClient.product.update({
            where: { id: Number(id) },
            data: { ...body },
        });

        return res.status(200).json({
            message: "Produto atualizado com sucesso!",
            data: updated,
        });

       
} catch (error) {
        if ((error as PrismaClientKnownRequestError).code == "P2025") {
            res.status(404).send('Produto não encontrado!')
        }
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
};

export const deleteProductById =  async(req:Request, res:Response)=>{
    try {
        const {id} = req.params;

        const product = await prismaClient.product.findUnique({
            where:{id: Number(id)},
        });

       res.status(200).send("Produto excluído com sucesso!")
    } catch (error) {
        if ((error as PrismaClientKnownRequestError).code == "P2025") {
            res.status(404).send('Produto não encontrado!')
        }
        console.log(error);
        res.status(500).send(`Erro no servidor: ${error}`)
    }
};