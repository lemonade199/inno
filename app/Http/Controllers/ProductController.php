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
            'status' => $p->stock > 5 ? 'Tersedia' : ($p->stock > 0 ? 'Stok Menipis' : 'Habis'),
            'image' => $p->image ?: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
            'description' => $p->description,
            'createdAt' => $p->created_at->format('Y-m-d'),
        ]);
    }

    public function store(Request $request)
    {
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $imagePath = '/storage/' . $imagePath;
        }

        $p = Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $imagePath,
            'description' => $request->description,
        ]);
        return response()->json(['id' => $p->id]);
    }

    public function update(Request $request, $id)
    {
        $p = Product::find($id);
        if ($p) {
            $data = $request->only(['name', 'category', 'price', 'stock', 'description']);
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
                $data['image'] = '/storage/' . $imagePath;
            }
            $p->update($data);
        }
        return response()->json(['success' => true]);
    }

    public function destroy($id)
    {
        $p = Product::find($id);
        if ($p) $p->delete();
        return response()->json(['success' => true]);
    }
}
