<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        // format output as expected by frontend
        $formatted = $products->map(function($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'category' => $p->category,
                'price' => $p->price,
                'stock' => $p->stock,
                'weight' => $p->weight ?? 500,
                'status' => $p->stock > 5 ? 'Tersedia' : ($p->stock > 0 ? 'Stok Menipis' : 'Habis'),
                'image' => $p->image ?: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
                'description' => $p->description,
                'createdAt' => $p->created_at->format('Y-m-d'),
            ];
        });
        return response()->json($formatted);
    }

    public function show($id)
    {
        $p = Product::find($id);
        if (!$p) return response()->json(null, 404);

        return response()->json([
            'id' => $p->id,
            'name' => $p->name,
            'category' => $p->category,
            'price' => $p->price,
            'stock' => $p->stock,
            'weight' => $p->weight ?? 500,
            'status' => $p->stock > 5 ? 'Tersedia' : ($p->stock > 0 ? 'Stok Menipis' : 'Habis'),
            'image' => $p->image ?: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
            'description' => $p->description,
            'createdAt' => $p->created_at->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'weight' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'image' => 'nullable',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
            ]);
            $imagePath = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $imagePath;
        } elseif ($request->filled('image') && is_string($request->image) && !str_starts_with($request->image, 'data:')) {
            $imagePath = $request->image;
        }

        $p = Product::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'weight' => !empty($validated['weight']) ? (int)$validated['weight'] : 500,
            'image' => $imagePath,
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'id' => $p->id,
            'product' => $p
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $p = Product::find($id);
        if (!$p) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'weight' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'image' => 'nullable',
        ]);

        $data = $request->only(['name', 'category', 'price', 'stock', 'weight', 'description']);
        
        if ($request->has('weight')) {
            $data['weight'] = !empty($request->weight) ? (int)$request->weight : 500;
        }

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,webp|max:2048'
            ]);
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        $p->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui',
            'product' => $p
        ]);
    }

    public function destroy($id)
    {
        $p = Product::find($id);
        if (!$p) {
            return response()->json(['message' => 'Produk tidak ditemukan.'], 404);
        }
        $p->delete();
        return response()->json(['success' => true, 'message' => 'Produk berhasil dihapus']);
    }
}
