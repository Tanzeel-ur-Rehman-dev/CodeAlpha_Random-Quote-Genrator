import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.*;
import java.util.*;

/**
 * Random Quote Generator — A sleek desktop app built with Java Swing.
 * Displays a random inspirational quote every time the user opens the app
 * or clicks the "New Quote" button.
 */
public class RandomQuoteGenerator extends JFrame {

    // ── Quote data ──────────────────────────────────────────────────────
    private static final String[][] QUOTES = {
        {"The only way to do great work is to love what you do.", "Steve Jobs"},
        {"Innovation distinguishes between a leader and a follower.", "Steve Jobs"},
        {"Stay hungry, stay foolish.", "Steve Jobs"},
        {"Life is what happens when you're busy making other plans.", "John Lennon"},
        {"The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt"},
        {"It is during our darkest moments that we must focus to see the light.", "Aristotle"},
        {"The purpose of our lives is to be happy.", "Dalai Lama"},
        {"Get busy living or get busy dying.", "Stephen King"},
        {"You only live once, but if you do it right, once is enough.", "Mae West"},
        {"In the middle of every difficulty lies opportunity.", "Albert Einstein"},
        {"Imagination is more important than knowledge.", "Albert Einstein"},
        {"The best time to plant a tree was 20 years ago. The second best time is now.", "Chinese Proverb"},
        {"An unexamined life is not worth living.", "Socrates"},
        {"Spread love everywhere you go. Let no one ever come to you without leaving happier.", "Mother Teresa"},
        {"The only impossible journey is the one you never begin.", "Tony Robbins"},
        {"Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill"},
        {"Believe you can and you're halfway there.", "Theodore Roosevelt"},
        {"Act as if what you do makes a difference. It does.", "William James"},
        {"What you get by achieving your goals is not as important as what you become by achieving your goals.", "Zig Ziglar"},
        {"You miss 100% of the shots you don't take.", "Wayne Gretzky"},
        {"Whether you think you can or you think you can't, you're right.", "Henry Ford"},
        {"The mind is everything. What you think you become.", "Buddha"},
        {"Strive not to be a success, but rather to be of value.", "Albert Einstein"},
        {"Two roads diverged in a wood, and I — I took the one less traveled by, and that has made all the difference.", "Robert Frost"},
        {"Do what you can, with what you have, where you are.", "Theodore Roosevelt"},
        {"The best revenge is massive success.", "Frank Sinatra"},
        {"Everything you've ever wanted is on the other side of fear.", "George Addair"},
        {"Happiness is not something ready-made. It comes from your own actions.", "Dalai Lama"},
        {"If you want to lift yourself up, lift up someone else.", "Booker T. Washington"},
        {"Whoever is happy will make others happy too.", "Anne Frank"},
    };

    // ── Color palette ───────────────────────────────────────────────────
    private static final Color BG_DARK       = new Color(18, 18, 24);
    private static final Color CARD_BG       = new Color(28, 28, 40);
    private static final Color CARD_BORDER   = new Color(58, 58, 80);
    private static final Color ACCENT_START  = new Color(129, 91, 255);   // purple
    private static final Color ACCENT_END    = new Color(67, 198, 172);   // teal
    private static final Color TEXT_PRIMARY   = new Color(235, 235, 245);
    private static final Color TEXT_SECONDARY = new Color(160, 160, 185);
    private static final Color QUOTE_MARK_COLOR = new Color(129, 91, 255, 50);

    // ── State ───────────────────────────────────────────────────────────
    private final Random random = new Random();
    private int lastIndex = -1;
    private JLabel quoteLabel;
    private JLabel authorLabel;
    private JLabel counterLabel;
    private int quoteCount = 0;
    private float fadeAlpha = 1f;
    private javax.swing.Timer fadeTimer;

    // ── Constructor ─────────────────────────────────────────────────────
    public RandomQuoteGenerator() {
        setTitle("Random Quote Generator");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(720, 520);
        setMinimumSize(new Dimension(520, 400));
        setLocationRelativeTo(null);
        setResizable(true);

        // Main panel with gradient background
        JPanel mainPanel = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                // Dark gradient background
                GradientPaint gp = new GradientPaint(0, 0, BG_DARK,
                        getWidth(), getHeight(), new Color(24, 20, 36));
                g2.setPaint(gp);
                g2.fillRect(0, 0, getWidth(), getHeight());

                // Subtle accent glow top-right
                g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.06f));
                RadialGradientPaint rgp = new RadialGradientPaint(
                        new Point2D.Float(getWidth() * 0.8f, getHeight() * 0.15f),
                        getWidth() * 0.5f,
                        new float[]{0f, 1f},
                        new Color[]{ACCENT_START, new Color(0, 0, 0, 0)});
                g2.setPaint(rgp);
                g2.fillRect(0, 0, getWidth(), getHeight());

                // Subtle accent glow bottom-left
                RadialGradientPaint rgp2 = new RadialGradientPaint(
                        new Point2D.Float(getWidth() * 0.2f, getHeight() * 0.85f),
                        getWidth() * 0.45f,
                        new float[]{0f, 1f},
                        new Color[]{ACCENT_END, new Color(0, 0, 0, 0)});
                g2.setPaint(rgp2);
                g2.fillRect(0, 0, getWidth(), getHeight());

                g2.dispose();
            }
        };
        mainPanel.setBorder(BorderFactory.createEmptyBorder(30, 40, 30, 40));

        // ── Header ──────────────────────────────────────────────────────
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setOpaque(false);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(0, 0, 20, 0));

        JLabel titleLabel = new JLabel("✦  Quote of the Moment");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        titleLabel.setForeground(TEXT_PRIMARY);
        headerPanel.add(titleLabel, BorderLayout.WEST);

        counterLabel = new JLabel("Quotes viewed: 0");
        counterLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        counterLabel.setForeground(TEXT_SECONDARY);
        headerPanel.add(counterLabel, BorderLayout.EAST);

        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // ── Quote card ──────────────────────────────────────────────────
        JPanel cardPanel = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                // Card background with rounded corners
                RoundRectangle2D cardShape = new RoundRectangle2D.Float(
                        0, 0, getWidth(), getHeight(), 24, 24);
                g2.setColor(CARD_BG);
                g2.fill(cardShape);

                // Border glow
                g2.setStroke(new BasicStroke(1.2f));
                g2.setColor(CARD_BORDER);
                g2.draw(cardShape);

                // Large decorative opening quote mark
                g2.setFont(new Font("Georgia", Font.BOLD, 160));
                g2.setColor(QUOTE_MARK_COLOR);
                g2.drawString("\u201C", 20, 120);

                g2.dispose();
            }
        };
        cardPanel.setOpaque(false);
        cardPanel.setBorder(BorderFactory.createEmptyBorder(50, 50, 40, 50));

        // Quote text
        quoteLabel = new JLabel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, fadeAlpha));
                super.paintComponent(g2);
                g2.dispose();
            }
        };
        quoteLabel.setFont(new Font("Georgia", Font.ITALIC, 20));
        quoteLabel.setForeground(TEXT_PRIMARY);
        quoteLabel.setVerticalAlignment(SwingConstants.CENTER);
        quoteLabel.setHorizontalAlignment(SwingConstants.CENTER);
        quoteLabel.setBorder(BorderFactory.createEmptyBorder(10, 0, 20, 0));
        // Enable word wrapping
        quoteLabel.setText("<html><div style='text-align:center; line-height:1.6;'></div></html>");

        // Author name
        authorLabel = new JLabel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, fadeAlpha));
                super.paintComponent(g2);
                g2.dispose();
            }
        };
        authorLabel.setFont(new Font("Segoe UI", Font.BOLD, 15));
        authorLabel.setForeground(ACCENT_END);
        authorLabel.setHorizontalAlignment(SwingConstants.CENTER);
        authorLabel.setBorder(BorderFactory.createEmptyBorder(5, 0, 0, 0));

        // Wrapper for quote + author inside card
        JPanel quoteWrapper = new JPanel(new BorderLayout());
        quoteWrapper.setOpaque(false);
        quoteWrapper.add(quoteLabel, BorderLayout.CENTER);
        quoteWrapper.add(authorLabel, BorderLayout.SOUTH);

        cardPanel.add(quoteWrapper, BorderLayout.CENTER);
        mainPanel.add(cardPanel, BorderLayout.CENTER);

        // ── Bottom panel with button ────────────────────────────────────
        JPanel bottomPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 0));
        bottomPanel.setOpaque(false);
        bottomPanel.setBorder(BorderFactory.createEmptyBorder(25, 0, 0, 0));

        JButton newQuoteBtn = createGradientButton("✦  New Quote");
        newQuoteBtn.addActionListener(e -> showNewQuoteWithAnimation());

        // Keyboard shortcut: press Space or Enter for new quote
        getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0), "newQuote");
        getRootPane().getInputMap(JComponent.WHEN_IN_FOCUSED_WINDOW)
                .put(KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0), "newQuote");
        getRootPane().getActionMap().put("newQuote", new AbstractAction() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showNewQuoteWithAnimation();
            }
        });

        bottomPanel.add(newQuoteBtn);
        mainPanel.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(mainPanel);

        // Show initial quote
        showNewQuote();
    }

    // ── Animated quote transition ───────────────────────────────────────
    private void showNewQuoteWithAnimation() {
        if (fadeTimer != null && fadeTimer.isRunning()) {
            fadeTimer.stop();
        }

        // Fade out
        fadeTimer = new javax.swing.Timer(16, null);
        fadeTimer.addActionListener(new ActionListener() {
            boolean fadingOut = true;

            @Override
            public void actionPerformed(ActionEvent e) {
                if (fadingOut) {
                    fadeAlpha -= 0.08f;
                    if (fadeAlpha <= 0f) {
                        fadeAlpha = 0f;
                        fadingOut = false;
                        showNewQuote(); // swap text while invisible
                    }
                } else {
                    fadeAlpha += 0.06f;
                    if (fadeAlpha >= 1f) {
                        fadeAlpha = 1f;
                        fadeTimer.stop();
                    }
                }
                quoteLabel.repaint();
                authorLabel.repaint();
            }
        });
        fadeTimer.start();
    }

    // ── Pick and display a new random quote ─────────────────────────────
    private void showNewQuote() {
        int index;
        do {
            index = random.nextInt(QUOTES.length);
        } while (index == lastIndex && QUOTES.length > 1);
        lastIndex = index;

        String text = QUOTES[index][0];
        String author = QUOTES[index][1];

        quoteLabel.setText("<html><div style='text-align:center; line-height:1.6;'>"
                + "\u201C" + text + "\u201D" + "</div></html>");
        authorLabel.setText("— " + author);

        quoteCount++;
        counterLabel.setText("Quotes viewed: " + quoteCount);
    }

    // ── Gradient-styled button ──────────────────────────────────────────
    private JButton createGradientButton(String text) {
        JButton button = new JButton(text) {
            private boolean hovering = false;

            {
                setOpaque(false);
                setContentAreaFilled(false);
                setFocusPainted(false);
                setBorderPainted(false);
                setCursor(new Cursor(Cursor.HAND_CURSOR));
                setFont(new Font("Segoe UI", Font.BOLD, 15));
                setForeground(Color.WHITE);
                setPreferredSize(new Dimension(200, 50));

                addMouseListener(new MouseAdapter() {
                    @Override
                    public void mouseEntered(MouseEvent e) {
                        hovering = true;
                        repaint();
                    }

                    @Override
                    public void mouseExited(MouseEvent e) {
                        hovering = false;
                        repaint();
                    }
                });
            }

            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                int w = getWidth(), h = getHeight();
                RoundRectangle2D shape = new RoundRectangle2D.Float(0, 0, w, h, 30, 30);

                // Gradient fill
                GradientPaint gp = new GradientPaint(0, 0, ACCENT_START, w, 0, ACCENT_END);
                g2.setPaint(gp);
                g2.fill(shape);

                // Hover glow
                if (hovering) {
                    g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.2f));
                    g2.setColor(Color.WHITE);
                    g2.fill(shape);
                    g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1f));
                }

                // Draw text
                FontMetrics fm = g2.getFontMetrics(getFont());
                g2.setFont(getFont());
                g2.setColor(getForeground());
                int tx = (w - fm.stringWidth(getText())) / 2;
                int ty = (h - fm.getHeight()) / 2 + fm.getAscent();
                g2.drawString(getText(), tx, ty);

                g2.dispose();
            }
        };
        return button;
    }

    // ── Main ────────────────────────────────────────────────────────────
    public static void main(String[] args) {
        // Use system look-and-feel for native feel, then override with custom painting
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        SwingUtilities.invokeLater(() -> {
            RandomQuoteGenerator app = new RandomQuoteGenerator();
            app.setVisible(true);
        });
    }
}
