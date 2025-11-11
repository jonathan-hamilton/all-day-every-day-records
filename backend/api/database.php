<?php

/**
 * Simple Database Connection and Query Helper
 * 
 * No singletons, no complex patterns - just a simple database helper
 * that handles the connection and common query operations.
 */

class Database 
{
    private $pdo;
    
    public function __construct($config) 
    {
        $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        try {
            $this->pdo = new PDO($dsn, $config['username'], $config['password'], $options);
        } catch (PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    /**
     * Execute a query and return all results
     */
    public function query($sql, $params = []) 
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
    
    /**
     * Execute a query and return single result
     */
    public function queryOne($sql, $params = []) 
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }
    
    /**
     * Execute a query and return single value
     */
    public function queryValue($sql, $params = []) 
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }
    
    /**
     * Execute an insert/update/delete query
     */
    public function execute($sql, $params = []) 
    {
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }
    
    /**
     * Get the last inserted ID
     */
    public function lastInsertId() 
    {
        return $this->pdo->lastInsertId();
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction() 
    {
        return $this->pdo->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public function commit() 
    {
        return $this->pdo->commit();
    }
    
    /**
     * Rollback transaction
     */
    public function rollback() 
    {
        return $this->pdo->rollback();
    }
    
    /**
     * Check if database connection is working
     */
    public function isConnected() 
    {
        try {
            $this->queryValue('SELECT 1');
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}