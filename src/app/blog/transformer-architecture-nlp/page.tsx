"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Tag, Share2, Brain, Layers, Zap, Code, TrendingUp } from "lucide-react"

export default function BlogPost() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Machine Learning
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              December 15, 2023
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              20 min read
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Understanding Transformer Architecture in NLP
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Deep dive into the transformer architecture that powers modern natural language processing models.
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">H</span>
              </div>
              <div>
                <p className="font-medium text-foreground">HumbleBabs</p>
                <p className="text-sm text-muted-foreground">Data Scientist & AI Engineer</p>
              </div>
            </div>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The transformer architecture has revolutionized natural language processing, enabling 
              models like BERT, GPT, and T5 to achieve unprecedented performance on a wide range 
              of language tasks.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In this comprehensive guide, we'll explore the transformer architecture in detail, 
              understanding its key components, how it works, and why it has become the foundation 
              for modern NLP systems.
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6">The Evolution of NLP</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Understanding the transformer requires context about previous approaches:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">RNNs & LSTMs</h3>
              <p className="text-muted-foreground text-sm">
                Sequential processing with memory, but limited by vanishing gradients and parallelization.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">CNNs</h3>
              <p className="text-muted-foreground text-sm">
                Parallel processing with local feature extraction, but limited context window.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transformers</h3>
              <p className="text-muted-foreground text-sm">
                Parallel processing with global attention, enabling long-range dependencies.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Key Components of Transformers</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The transformer architecture consists of several key components:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Core Components:</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Self-Attention Mechanism</h4>
                  <p className="text-sm text-muted-foreground">Allows tokens to attend to all other tokens in the sequence</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Multi-Head Attention</h4>
                  <p className="text-sm text-muted-foreground">Multiple attention heads capture different types of relationships</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Positional Encoding</h4>
                  <p className="text-sm text-muted-foreground">Adds position information to token embeddings</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Feed-Forward Networks</h4>
                  <p className="text-sm text-muted-foreground">Process attention outputs with non-linear transformations</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Self-Attention Mechanism</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The heart of the transformer is the self-attention mechanism:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Attention Formula</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Self-attention computes attention weights using Query, Key, and Value matrices.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`Attention(Q,K,V) = softmax(QK^T/√d_k)V

Where:
- Q: Query matrix
- K: Key matrix  
- V: Value matrix
- d_k: Dimension of keys`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Multi-Head Attention</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Multiple attention heads allow the model to focus on different aspects of the input.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O

Where each head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Scaled Dot-Product Attention</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The scaling factor prevents gradients from becoming too large.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`def scaled_dot_product_attention(Q, K, V, mask=None):
    scores = torch.matmul(Q, K.transpose(-2, -1))
    scores = scores / math.sqrt(K.size(-1))
    
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -1e9)
    
    attention_weights = F.softmax(scores, dim=-1)
    return torch.matmul(attention_weights, V)`}
                </pre>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Positional Encoding</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Since transformers process all tokens in parallel, they need explicit position information:
          </p>

          <div className="bg-primary/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Sinusoidal Positional Encoding:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Unique Encoding:</strong> Each position gets a unique encoding vector
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Generalization:</strong> Can generalize to sequences longer than training data
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  <strong>Relative Positions:</strong> Encodes relative position information through trigonometric functions
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Transformer Architecture</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The complete transformer architecture combines these components:
          </p>

          <div className="space-y-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Encoder-Decoder Structure</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The original transformer uses an encoder-decoder architecture for sequence-to-sequence tasks.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`class Transformer(nn.Module):
    def __init__(self, d_model, n_heads, n_layers):
        super().__init__()
        self.encoder = Encoder(d_model, n_heads, n_layers)
        self.decoder = Decoder(d_model, n_heads, n_layers)
        
    def forward(self, src, tgt):
        enc_output = self.encoder(src)
        dec_output = self.decoder(tgt, enc_output)
        return dec_output`}
                </pre>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-xl font-semibold mb-3">Encoder Layer</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each encoder layer consists of self-attention and feed-forward networks with residual connections.
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="text-sm text-muted-foreground overflow-x-auto">
{`class EncoderLayer(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, n_heads)
        self.feed_forward = FeedForward(d_model)
        self.norm1 = LayerNorm(d_model)
        self.norm2 = LayerNorm(d_model)
        
    def forward(self, x):
        attn_output = self.self_attn(x)
        x = self.norm1(x + attn_output)
        ff_output = self.feed_forward(x)
        return self.norm2(x + ff_output)`}
                </pre>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Modern Transformer Variants</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Several variants have emerged to address different challenges:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">BERT</h3>
              <p className="text-muted-foreground text-sm">
                Bidirectional encoder with masked language modeling and next sentence prediction.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">GPT</h3>
              <p className="text-muted-foreground text-sm">
                Decoder-only architecture with autoregressive language modeling.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">T5</h3>
              <p className="text-muted-foreground text-sm">
                Unified text-to-text framework for all NLP tasks.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Efficient Transformers</h3>
              <p className="text-muted-foreground text-sm">
                Variants like Linformer and Performer for linear complexity.
              </p>
            </motion.div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Challenges and Limitations</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Despite their success, transformers have several limitations:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Computational Complexity:</strong> O(n²) complexity with sequence length
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Memory Requirements:</strong> High memory usage for long sequences
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Training Data:</strong> Requires massive amounts of training data
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">
                <strong>Interpretability:</strong> Black-box nature makes debugging difficult
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Future Directions</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Research continues to address transformer limitations:
          </p>

          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Efficient Attention</h4>
                  <p className="text-sm text-muted-foreground">Linear attention mechanisms and sparse attention</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Multimodal Models</h4>
                  <p className="text-sm text-muted-foreground">Integrating vision, audio, and text</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold">Few-Shot Learning</h4>
                  <p className="text-sm text-muted-foreground">Learning from minimal examples</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The transformer architecture has fundamentally changed the landscape of natural language 
            processing, enabling models that can understand and generate human language with 
            unprecedented accuracy.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Understanding the transformer architecture is essential for anyone working in modern NLP. 
            While challenges remain, ongoing research continues to push the boundaries of what's 
            possible with these powerful models.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-4 mb-4">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-foreground">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["NLP", "Transformers", "Deep Learning", "BERT", "Attention", "Machine Learning"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
} 